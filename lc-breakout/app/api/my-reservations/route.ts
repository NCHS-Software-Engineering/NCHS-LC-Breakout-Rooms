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

    // 2️⃣ Get only future reservations
    const [reservationRows] = await db.query<RowDataPacket[]>(
        `SELECT 
            RoomID, 
            SlotID, 
            DATE_FORMAT(ReservationDate, '%Y-%m-%d') AS ReservationDate,
            CreatedAt
        FROM Reservations
        WHERE Email = ?
            AND ReservationDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        ORDER BY ReservationDate, SlotID`,
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