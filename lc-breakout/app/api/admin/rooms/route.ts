import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Show occupancy only for the currently active period on the current weekday.
    const [rooms] = await connection.execute(`
      SELECT 
        r.RoomID as id,
        CONCAT('Room ', r.RoomID) as name,
        res.ReservationID as currentReservationID,
        COALESCE(u.Name, SUBSTRING_INDEX(res.Email, '@', 1), res.Email) as currentOccupant,
        CASE
          WHEN res.Email IS NULL THEN NULL
          WHEN res.Email LIKE '%@%' THEN res.Email
          ELSE CONCAT(res.Email, '@nchs.local')
        END as currentOccupantEmail,
        ts.PeriodLabel as currentPeriod,
        TIME_FORMAT(ts.StartTime, '%l:%i %p') as startTime,
        TIME_FORMAT(ts.EndTime, '%l:%i %p') as endTime
      FROM (
        SELECT 1 as RoomID
        UNION SELECT 2 as RoomID
        UNION SELECT 3 as RoomID
      ) r
      LEFT JOIN (
        SELECT SlotID, PeriodLabel, StartTime, EndTime
        FROM TimeSlots
        WHERE DayOfWeek = WEEKDAY(CURDATE()) + 1
          AND CURTIME() BETWEEN StartTime AND EndTime
        ORDER BY PeriodNumber
        LIMIT 1
      ) active_ts ON 1 = 1
      LEFT JOIN Reservations res
        ON res.RoomID = r.RoomID
        AND res.ReservationDate = CURDATE()
        AND res.SlotID = active_ts.SlotID
      LEFT JOIN Users u
        ON u.Email = res.Email
      LEFT JOIN TimeSlots ts
        ON ts.SlotID = active_ts.SlotID
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
