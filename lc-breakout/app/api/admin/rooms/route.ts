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

    // Get current room occupancy for today
    const [rooms] = await connection.execute(`
      SELECT 
        r.RoomID as id,
        CONCAT('Room ', r.RoomID) as name,
        MAX(res.UserID) as currentOccupant
      FROM (
        SELECT 1 as RoomID
        UNION SELECT 2 as RoomID
        UNION SELECT 3 as RoomID
      ) r
      LEFT JOIN Reservations res 
        ON r.RoomID = res.RoomID 
        AND res.ReservationDate = CURDATE()
      GROUP BY r.RoomID
      ORDER BY r.RoomID
    `);

    await connection.end();

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Fetch rooms error:", error);
    return NextResponse.json(
      { error: "Failed to fetch room occupancy" },
      { status: 500 }
    );
  }
}
