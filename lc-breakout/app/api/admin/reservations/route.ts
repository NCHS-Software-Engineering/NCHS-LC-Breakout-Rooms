import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

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
        r.UserID as guestName,
        'user@email.com' as email,
        r.ReservationDate as date,
        ts.StartTime as startTime,
        ts.EndTime as endTime,
        r.RoomID as roomNumber,
        CONCAT('room', r.RoomID) as roomId
      FROM Reservations r
      JOIN TimeSlots ts ON r.SlotID = ts.SlotID
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
