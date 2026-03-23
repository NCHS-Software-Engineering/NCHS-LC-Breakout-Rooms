import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

interface ReservationRequest {
  slotID: number;
  userID?: string;
  email?: string;
  roomID: number;
  reservationDate: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReservationRequest = await request.json();
    const { slotID, userID, email, roomID, reservationDate } = body;
    const reservationEmail = email ?? userID;

    // Validate input
    if (!slotID || !reservationEmail || !roomID || !reservationDate) {
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

    // Check if room is already reserved for this slot and date
    const [existing] = await connection.execute(
      `SELECT * FROM Reservations WHERE SlotID = ? AND RoomID = ? AND ReservationDate = ?`,
      [slotID, roomID, reservationDate]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: "This room is already reserved for this time slot" },
        { status: 409 }
      );
    }

    // Create the reservation
    await connection.execute(
      `INSERT INTO Reservations (SlotID, Email, RoomID, ReservationDate, CreatedAt) 
       VALUES (?, ?, ?, ?, NOW())`,
      [slotID, reservationEmail, roomID, reservationDate]
    );

    await connection.end();

    return NextResponse.json(
      { success: true, message: "Reservation created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reservation error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Detailed error:", errorMessage);
    return NextResponse.json(
      { error: "Failed to create reservation", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userID = request.nextUrl.searchParams.get("userID");
    const email = request.nextUrl.searchParams.get("email");
    const filterEmail = email ?? userID;

    const connection = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    let query = `
      SELECT r.*, ts.PeriodLabel, TIME_FORMAT(ts.StartTime, '%l:%i %p') as StartTime, TIME_FORMAT(ts.EndTime, '%l:%i %p') as EndTime, ts.DayOfWeek
      FROM Reservations r
      JOIN TimeSlots ts ON r.SlotID = ts.SlotID
      WHERE r.ReservationDate = CURDATE()
    `;

    const params: string[] = [];

    if (filterEmail) {
      query += ` AND r.Email = ?`;
      params.push(filterEmail);
    }

    query += ` ORDER BY ts.DayOfWeek, ts.PeriodNumber`;

    const [reservations] = await connection.execute(query, params);
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
      { success: true, message: "Reservation cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete reservation error:", error);
    return NextResponse.json(
      { error: "Failed to delete reservation" },
      { status: 500 }
    );
  }
}
