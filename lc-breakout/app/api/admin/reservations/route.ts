import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

interface CreateReservationRequest {
  slotID: number;
  guestName?: string;
  email: string;
  roomID: number;
  reservationDate: string;
}

export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Get all reservations with time slot and room info
    const [reservations] = await connection.execute(`
      SELECT 
        r.ReservationID as id,
        r.SlotID,
        COALESCE(u.Name, SUBSTRING_INDEX(r.Email, '@', 1)) as guestName,
        r.Email as email,
        DATE_FORMAT(r.ReservationDate, '%Y-%m-%d') as date,
        TIME_FORMAT(ts.StartTime, '%l:%i %p') as startTime,
        TIME_FORMAT(ts.EndTime, '%l:%i %p') as endTime,
        r.RoomID as roomNumber,
        CONCAT('room', r.RoomID) as roomId
      FROM Reservations r
      JOIN TimeSlots ts ON r.SlotID = ts.SlotID
      LEFT JOIN Users u ON u.Email = r.Email
      ORDER BY r.ReservationDate DESC, ts.StartTime ASC
    `);

    await connection.end();

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Fetch reservations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateReservationRequest = await request.json();
    const { slotID, guestName, email, roomID, reservationDate } = body;

    if (!slotID || !email || !roomID || !reservationDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const connection = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Ensure the selected slot belongs to the selected date's weekday.
    const [slotRows] = await connection.execute(
      `
      SELECT SlotID
      FROM TimeSlots
      WHERE SlotID = ?
        AND DayOfWeek = WEEKDAY(?) + 1
      `,
      [slotID, reservationDate]
    );

    if (!Array.isArray(slotRows) || slotRows.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: "Selected period does not match the selected date" },
        { status: 400 }
      );
    }

    const [existing] = await connection.execute(
      `SELECT ReservationID FROM Reservations WHERE SlotID = ? AND RoomID = ? AND ReservationDate = ?`,
      [slotID, roomID, reservationDate]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: "This room is already reserved for the selected period" },
        { status: 409 }
      );
    }

    if (guestName && guestName.trim()) {
      await connection.execute(
        `
        INSERT INTO Users (Email, Name, CreatedAt)
        VALUES (?, ?, NOW())
        ON DUPLICATE KEY UPDATE Name = VALUES(Name)
        `,
        [email, guestName.trim()]
      );
    }

    await connection.execute(
      `
      INSERT INTO Reservations (SlotID, Email, RoomID, ReservationDate, CreatedAt)
      VALUES (?, ?, ?, ?, NOW())
      `,
      [slotID, email, roomID, reservationDate]
    );

    await connection.end();

    return NextResponse.json(
      { success: true, message: "Reservation created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create reservation error:", error);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { reservationID } = body;

    if (!reservationID) {
      return NextResponse.json(
        { error: "Reservation ID is required" },
        { status: 400 }
      );
    }

    const connection = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await connection.execute(
      `DELETE FROM Reservations WHERE ReservationID = ?`,
      [reservationID]
    );

    await connection.end();

    return NextResponse.json(
      { success: true, message: "Reservation removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete reservation error:", error);
    return NextResponse.json(
      { error: "Failed to remove reservation" },
      { status: 500 }
    );
  }
}
