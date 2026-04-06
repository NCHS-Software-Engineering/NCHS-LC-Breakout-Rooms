import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import db from "../../lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;

    // 1️⃣ Get user's cooldown
    const [userRows] = await db.query<RowDataPacket[]>(
      `SELECT CooldownUntil FROM Users WHERE Email = ?`,
      [email]
    );
    const cooldown = userRows[0]?.CooldownUntil || null;

    // 2️⃣ Get only future reservations with period names
    const [reservationRows] = await db.query<RowDataPacket[]>(
        `SELECT 
            r.RoomID, 
            r.SlotID, 
            DATE_FORMAT(r.ReservationDate, '%Y-%m-%d') AS ReservationDate,
            r.CreatedAt,
            ts.PeriodLabel AS PeriodName
        FROM Reservations r
        LEFT JOIN TimeSlots ts ON r.SlotID = ts.SlotID
        WHERE r.Email = ?
            AND r.ReservationDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        ORDER BY r.ReservationDate, r.SlotID`,
        [email]
        );

    return NextResponse.json({
      cooldown,
      reservations: reservationRows,
    });

  } catch (err) {
    console.error("API /my-reservations error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}