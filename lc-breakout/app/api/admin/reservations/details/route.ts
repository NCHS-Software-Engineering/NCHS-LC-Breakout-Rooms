import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import db from "@/app/lib/db";
import { requireAdminSession } from "@/app/api/admin/_lib/auth";
import { formatTimeToAmPm } from "@/app/lib/time";

type ReservationDetailsRow = RowDataPacket & {
  id: number;
  roomNumber: number;
  email: string;
  guestName: string | null;
  date: string;
  period: string;
  startTime: string;
  endTime: string;
  createdAt: Date;
};

export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdminSession();
    if (errorResponse) {
      return errorResponse;
    }

    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    const slotId = Number(url.searchParams.get("slotId"));
    const roomId = Number(url.searchParams.get("roomId"));

    if (!date || Number.isNaN(slotId) || Number.isNaN(roomId)) {
      return NextResponse.json(
        { error: "Missing or invalid date, slotId, or roomId" },
        { status: 400 }
      );
    }

    const [rows] = await db.query<ReservationDetailsRow[]>(
      `SELECT
         r.ReservationID AS id,
         r.RoomID AS roomNumber,
         r.Email AS email,
         u.Name AS guestName,
         DATE_FORMAT(r.ReservationDate, '%Y-%m-%d') AS date,
         ts.PeriodLabel AS period,
         ts.StartTime AS startTime,
         ts.EndTime AS endTime,
         r.CreatedAt AS createdAt
       FROM Reservation r
       JOIN TimeSlot ts ON ts.SlotID = r.SlotID
       LEFT JOIN User u ON u.Email = r.Email
       WHERE r.ReservationDate = ?
         AND r.SlotID = ?
         AND r.RoomID = ?
       ORDER BY r.CreatedAt DESC`,
      [date, slotId, roomId]
    );

    const reservations = rows.map((row) => ({
      id: String(row.id),
      roomNumber: row.roomNumber,
      email: row.email,
      guestName: row.guestName || row.email,
      date: row.date,
      period: row.period,
      startTime: formatTimeToAmPm(row.startTime),
      endTime: formatTimeToAmPm(row.endTime),
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    }));

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Admin reservation details GET error:", error);
    return NextResponse.json({ error: "Failed to fetch reservation details" }, { status: 500 });
  }
}
