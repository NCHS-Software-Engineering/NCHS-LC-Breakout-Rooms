import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

type DBRow = RowDataPacket & {
  DayNum: number
  PeriodName: string
  StartTime: string
  EndTime: string
  Room1: number
  Room2: number
  Room3: number
}

export async function GET() {
    try {

    
        
    const connection = await mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });


    
    const [rows] = await connection.execute<DBRow[]>(`
        SELECT 
            ts.DayOfWeek AS DayNum,
            ts.PeriodLabel AS PeriodName,
            ts.StartTime,
            ts.EndTime,

            CASE WHEN COUNT(CASE WHEN r.RoomID = 1 THEN 1 END) > 0 THEN 1 ELSE 0 END AS Room1,
            CASE WHEN COUNT(CASE WHEN r.RoomID = 2 THEN 1 END) > 0 THEN 1 ELSE 0 END AS Room2,
            CASE WHEN COUNT(CASE WHEN r.RoomID = 3 THEN 1 END) > 0 THEN 1 ELSE 0 END AS Room3

        FROM TimeSlots ts
        LEFT JOIN Reservations r 
            ON ts.SlotID = r.SlotID
            AND r.ReservationDate = CURDATE()

        GROUP BY ts.SlotID
        ORDER BY ts.DayOfWeek, ts.PeriodNumber   
    `);


    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

    const formatted = rows.map(row => ({
    DayNum: row.DayNum,
    DayName: days[row.DayNum - 1],
    PeriodName: row.PeriodName,
    StartTime: row.StartTime,
    EndTime: row.EndTime,
    Room1: Boolean(row.Room1),
    Room2: Boolean(row.Room2),
    Room3: Boolean(row.Room3),
    }));

    return NextResponse.json(formatted);
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Failed to fetch periods."}, {status: 500});
    }
}
