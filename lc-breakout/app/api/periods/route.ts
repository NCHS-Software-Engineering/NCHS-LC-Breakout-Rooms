import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";
import connection from "@/app/lib/db";
import { formatTimeToAmPm } from "@/app/lib/time";

type DBRow = RowDataPacket & {
  DayNum: number;
  PeriodLabel: string;
  StartTime: string;
  EndTime: string;
  Room1: number;
  Room2: number;
  Room3: number;
  SlotID: number;
};

export async function GET(req: Request) {
  try {
    // 1️⃣ Get selected date from query string
    const url = new URL(req.url);
    const selectedDate = url.searchParams.get("date");
    if (!selectedDate) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    // 2️⃣ Query periods and reservations for that date
    const [rows] = await connection.execute<DBRow[]>(
      `
      SELECT 
        ts.DayOfWeek AS DayNum,
        ts.PeriodLabel AS PeriodName,
        ts.StartTime,
        ts.EndTime,
        ts.SlotID,
        -- sum for each room; 1 = occupied, 0 = vacant
        CASE WHEN SUM(CASE WHEN r.RoomID = 1 THEN 1 ELSE 0 END) > 0 THEN 1 ELSE 0 END AS Room1,
        CASE WHEN SUM(CASE WHEN r.RoomID = 2 THEN 1 ELSE 0 END) > 0 THEN 1 ELSE 0 END AS Room2,
        CASE WHEN SUM(CASE WHEN r.RoomID = 3 THEN 1 ELSE 0 END) > 0 THEN 1 ELSE 0 END AS Room3
      FROM TimeSlots ts
      LEFT JOIN Reservations r
        ON ts.SlotID = r.SlotID
        AND r.ReservationDate = ?
      GROUP BY ts.SlotID
      ORDER BY ts.DayOfWeek, ts.PeriodNumber
      `,
      [selectedDate] // ✅ parameterized query
    );

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    // 3️⃣ Format rows for frontend
    const formatted = rows.map((row) => ({
      DayNum: row.DayNum,
      DayName: days[row.DayNum - 1],
      PeriodName: row.PeriodName,
      StartTime: formatTimeToAmPm(row.StartTime),
      EndTime: formatTimeToAmPm(row.EndTime),
      Room1: row.Room1 === 0, // true = vacant
      Room2: row.Room2 === 0,
      Room3: row.Room3 === 0,
      SlotID: row.SlotID, // pass slotID for each period
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch periods" }, { status: 500 });
  }
}