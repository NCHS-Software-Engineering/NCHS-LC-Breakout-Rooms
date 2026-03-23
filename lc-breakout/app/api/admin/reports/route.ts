import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: NextRequest) {
  try {
    const selectedDate = request.nextUrl.searchParams.get("date");
    const month = request.nextUrl.searchParams.get("month");

    const connection = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    let query = `
      SELECT
        r.ReservationID as id,
        COALESCE(u.Name, SUBSTRING_INDEX(r.Email, '@', 1)) as name,
        CASE
          WHEN r.Email LIKE '%@%' THEN r.Email
          ELSE CONCAT(r.Email, '@nchs.local')
        END as email,
        CONCAT('Room ', r.RoomID) as room,
        r.RoomID as roomNumber,
        DATE_FORMAT(r.ReservationDate, '%Y-%m-%d') as date,
        ts.PeriodLabel as period,
        TIME_FORMAT(ts.StartTime, '%l:%i %p') as startTime,
        TIME_FORMAT(ts.EndTime, '%l:%i %p') as endTime
      FROM Reservations r
      JOIN TimeSlots ts ON r.SlotID = ts.SlotID
      LEFT JOIN Users u ON u.Email = r.Email
    `;

    const params: string[] = [];

    if (selectedDate) {
      query += ` WHERE r.ReservationDate = ?`;
      params.push(selectedDate);
    } else if (month) {
      query += ` WHERE DATE_FORMAT(r.ReservationDate, '%Y-%m') = ?`;
      params.push(month);
    }

    query += ` ORDER BY r.ReservationDate DESC, r.RoomID ASC, ts.PeriodNumber ASC`;

    const [history] = await connection.execute(query, params);
    await connection.end();

    return NextResponse.json(history);
  } catch (error) {
    console.error("Fetch reports error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports data" },
      { status: 500 }
    );
  }
}
