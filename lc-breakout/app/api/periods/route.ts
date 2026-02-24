import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
    try {
        /*
    const connection = await mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
        
    const [rows] = await connection.execute(`
        SELECT 
			i.BranchNum,
            b.BranchName,
            m.Title,
            m.Price,
            d.DirectorFirst,
            d.DirectorLast,
            i.OnHand
        FROM Movie m
        JOIN Directed dr ON m.MovieCode = dr.MovieCode
        JOIN Director d ON dr.DirectorNum = d.DirectorNum
        LEFT JOIN Inventory i ON m.MovieCode = i.MovieCode
        JOIN Branch b ON i.BranchNum = b.BranchNum
        ORDER BY i.BranchNum ASC, Title ASC
    `);*/
    const rows = [
            // MONDAY
            { DayNum: 1, DayName: "Monday", PeriodName: "Period 1", StartTime: "7:45 AM", EndTime: "8:35 AM", Room1: true, Room2: true, Room3: false },
            { DayNum: 1, DayName: "Monday", PeriodName: "Period 2", StartTime: "8:41 AM", EndTime: "9:34 AM", Room1: false, Room2: true, Room3: true },
            { DayNum: 1, DayName: "Monday", PeriodName: "Period 3", StartTime: "9:40 AM", EndTime: "10:30 AM", Room1: true, Room2: false, Room3: true },
            { DayNum: 1, DayName: "Monday", PeriodName: "Period 4", StartTime: "10:36 AM", EndTime: "11:26 AM", Room1: true, Room2: true, Room3: true },
            { DayNum: 1, DayName: "Monday", PeriodName: "Period 5", StartTime: "11:32 AM", EndTime: "12:22 PM", Room1: false, Room2: false, Room3: true },
            { DayNum: 1, DayName: "Monday", PeriodName: "Period 6", StartTime: "12:28 PM", EndTime: "1:18 PM", Room1: true, Room2: true, Room3: false },
            { DayNum: 1, DayName: "Monday", PeriodName: "Period 7", StartTime: "1:24 PM", EndTime: "2:14 PM", Room1: true, Room2: true, Room3: true },
            { DayNum: 1, DayName: "Monday", PeriodName: "Period 8", StartTime: "2:20 PM", EndTime: "3:10 PM", Room1: false, Room2: true, Room3: true },
            
            // TUESDAY
            { DayNum: 2, DayName: "Tuesday", PeriodName: "Period 1", StartTime: "7:45 AM", EndTime: "8:30 AM", Room1: true, Room2: false, Room3: true },
            { DayNum: 2, DayName: "Tuesday", PeriodName: "Period 2", StartTime: "8:35 AM", EndTime: "9:20 AM", Room1: true, Room2: true, Room3: true },
            { DayNum: 2, DayName: "Tuesday", PeriodName: "SOAR", StartTime: "9:25 AM", EndTime: "10:10 AM", Room1: true, Room2: true, Room3: false },
            { DayNum: 2, DayName: "Tuesday", PeriodName: "Period 3", StartTime: "10:15 AM", EndTime: "11:00 AM", Room1: false, Room2: true, Room3: true },
            { DayNum: 2, DayName: "Tuesday", PeriodName: "Period 4", StartTime: "11:05 AM", EndTime: "11:50 AM", Room1: true, Room2: true, Room3: true },
            { DayNum: 2, DayName: "Tuesday", PeriodName: "Period 5", StartTime: "11:55 AM", EndTime: "12:40 PM", Room1: true, Room2: false, Room3: true },
            { DayNum: 2, DayName: "Tuesday", PeriodName: "Period 6", StartTime: "12:45 PM", EndTime: "1:30 PM", Room1: true, Room2: true, Room3: true },
            { DayNum: 2, DayName: "Tuesday", PeriodName: "Period 7", StartTime: "1:35 PM", EndTime: "2:20 PM", Room1: false, Room2: true, Room3: true },
            { DayNum: 2, DayName: "Tuesday", PeriodName: "Period 8", StartTime: "2:25 PM", EndTime: "3:10 PM", Room1: true, Room2: true, Room3: false },
            
            // WEDNESDAY
            { DayNum: 3, DayName: "Wednesday", PeriodName: "Period 1", StartTime: "9:00 AM", EndTime: "9:42 AM", Room1: true, Room2: true, Room3: true },
            { DayNum: 3, DayName: "Wednesday", PeriodName: "Period 2", StartTime: "9:47 AM", EndTime: "10:29 AM", Room1: true, Room2: false, Room3: true },
            { DayNum: 3, DayName: "Wednesday", PeriodName: "Period 3", StartTime: "10:34 AM", EndTime: "11:16 AM", Room1: false, Room2: true, Room3: true },
            { DayNum: 3, DayName: "Wednesday", PeriodName: "Period 4", StartTime: "11:21 AM", EndTime: "12:03 PM", Room1: true, Room2: true, Room3: false },
            { DayNum: 3, DayName: "Wednesday", PeriodName: "Period 5", StartTime: "12:08 PM", EndTime: "12:49 PM", Room1: true, Room2: true, Room3: true },
            { DayNum: 3, DayName: "Wednesday", PeriodName: "Period 6", StartTime: "12:54 PM", EndTime: "1:36 PM", Room1: true, Room2: false, Room3: true },
            { DayNum: 3, DayName: "Wednesday", PeriodName: "Period 7", StartTime: "1:41 PM", EndTime: "2:23 PM", Room1: true, Room2: true, Room3: true },
            { DayNum: 3, DayName: "Wednesday", PeriodName: "Period 8", StartTime: "2:28 PM", EndTime: "3:10 PM", Room1: false, Room2: true, Room3: true },
            
            // THURSDAY
            { DayNum: 4, DayName: "Thursday", PeriodName: "Period 1", StartTime: "7:45 AM", EndTime: "8:30 AM", Room1: false, Room2: true, Room3: true },
            { DayNum: 4, DayName: "Thursday", PeriodName: "Period 2", StartTime: "8:35 AM", EndTime: "9:20 AM", Room1: true, Room2: true, Room3: true },
            { DayNum: 4, DayName: "Thursday", PeriodName: "SOAR", StartTime: "9:25 AM", EndTime: "10:10 AM", Room1: true, Room2: true, Room3: false },
            { DayNum: 4, DayName: "Thursday", PeriodName: "Period 3", StartTime: "10:15 AM", EndTime: "11:00 AM", Room1: true, Room2: false, Room3: true },
            { DayNum: 4, DayName: "Thursday", PeriodName: "Period 4", StartTime: "11:05 AM", EndTime: "11:50 AM", Room1: true, Room2: true, Room3: true },
            { DayNum: 4, DayName: "Thursday", PeriodName: "Period 5", StartTime: "11:55 AM", EndTime: "12:40 PM", Room1: true, Room2: false, Room3: true },
            { DayNum: 4, DayName: "Thursday", PeriodName: "Period 6", StartTime: "12:45 PM", EndTime: "1:30 PM", Room1: true, Room2: true, Room3: true },
            { DayNum: 4, DayName: "Thursday", PeriodName: "Period 7", StartTime: "1:35 PM", EndTime: "2:20 PM", Room1: false, Room2: true, Room3: true },
            { DayNum: 4, DayName: "Thursday", PeriodName: "Period 8", StartTime: "2:25 PM", EndTime: "3:10 PM", Room1: true, Room2: true, Room3: false },
            
            // FRIDAY
            { DayNum: 5, DayName: "Friday", PeriodName: "Period 1", StartTime: "7:45 AM", EndTime: "8:35 AM", Room1: true, Room2: true, Room3: true },
            { DayNum: 5, DayName: "Friday", PeriodName: "Period 2", StartTime: "8:41 AM", EndTime: "9:34 AM", Room1: true, Room2: true, Room3: false },
            { DayNum: 5, DayName: "Friday", PeriodName: "Period 3", StartTime: "9:40 AM", EndTime: "10:30 AM", Room1: true, Room2: false, Room3: true },
            { DayNum: 5, DayName: "Friday", PeriodName: "Period 4", StartTime: "10:36 AM", EndTime: "11:26 AM", Room1: false, Room2: true, Room3: true },
            { DayNum: 5, DayName: "Friday", PeriodName: "Period 5", StartTime: "11:32 AM", EndTime: "12:22 PM", Room1: true, Room2: true, Room3: true },
            { DayNum: 5, DayName: "Friday", PeriodName: "Period 6", StartTime: "12:28 PM", EndTime: "1:18 PM", Room1: true, Room2: false, Room3: true },
            { DayNum: 5, DayName: "Friday", PeriodName: "Period 7", StartTime: "1:24 PM", EndTime: "2:14 PM", Room1: true, Room2: true, Room3: true },
            { DayNum: 5, DayName: "Friday", PeriodName: "Period 8", StartTime: "2:20 PM", EndTime: "3:10 PM", Room1: false, Room2: true, Room3: true },
        ];

    return NextResponse.json(rows);
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Failed to fetch periods."}, {status: 500});
    }
}
