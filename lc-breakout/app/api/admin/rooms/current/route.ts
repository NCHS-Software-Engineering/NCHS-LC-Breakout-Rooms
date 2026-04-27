import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import db from "@/app/lib/db";
import { requireAdminSession } from "@/app/api/admin/_lib/auth";
import { formatTimeToAmPm } from "@/app/lib/time";

type ActiveReservationRow = RowDataPacket & {
  reservationId: number;
  roomNumber: number;
  email: string;
  guestName: string | null;
  period: string;
  startTime: string;
  endTime: string;
};

export async function GET() {
  try {
    const { errorResponse } = await requireAdminSession();
    if (errorResponse) {
      return errorResponse;
    }

    const [rows] = await db.query<ActiveReservationRow[]>(
      `SELECT
         r.ReservationID AS reservationId,
         r.RoomID AS roomNumber,
         r.Email AS email,
         u.Name AS guestName,
         ts.PeriodLabel AS period,
         ts.StartTime AS startTime,
         ts.EndTime AS endTime
       FROM Reservation r
       JOIN TimeSlot ts ON ts.SlotID = r.SlotID
       LEFT JOIN User u ON u.Email = r.Email
       WHERE r.ReservationDate = CURDATE()
         AND TIME(NOW()) BETWEEN ts.StartTime AND ts.EndTime`
    );

    const rooms = [1, 2, 3].map((roomNumber) => {
      const activeReservation = rows.find((row) => row.roomNumber === roomNumber);

      return {
        id: `room${roomNumber}`,
        name: `Room ${roomNumber}`,
        currentOccupant: activeReservation
          ? {
              reservationId: String(activeReservation.reservationId),
              id: activeReservation.email,
              name: activeReservation.guestName || activeReservation.email,
              email: activeReservation.email,
              period: activeReservation.period,
              startTime: formatTimeToAmPm(activeReservation.startTime),
              endTime: formatTimeToAmPm(activeReservation.endTime),
            }
          : null,
      };
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Admin current rooms GET error:", error);
    return NextResponse.json({ error: "Failed to fetch room occupancy" }, { status: 500 });
  }
}
