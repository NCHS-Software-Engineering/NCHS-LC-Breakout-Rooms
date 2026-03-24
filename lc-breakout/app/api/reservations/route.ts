import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import db from "@/app/lib/db";
import { RowDataPacket } from "mysql2";


export async function POST(req: Request) {
  try {
    // 1. Get session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId, slotId, date } = await req.json();

    // 2. Validate input
    if (!roomId || !slotId || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }


    console.log("CHECKING RESERVATION:", {
    roomId,
    slotId,
    date
    });

    // 3. Check if already reserved
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM Reservations
      WHERE RoomID = ? 
      AND SlotID = ? 
      AND ReservationDate = ?`,
      [roomId, slotId, date]
    );

    console.log("ROWS:", rows);

    if (rows.length > 0) {
      return NextResponse.json(
        { error: "This room is already reserved" },
        { status: 409 }
      );
    }

    // Get user cooldown
    const [userRows] = await db.query<RowDataPacket[]>(
      `SELECT CooldownUntil FROM Users WHERE Email = ?`,
      [session.user.email]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cooldown = userRows[0].CooldownUntil;

    // Block if still on cooldown
    if (cooldown && new Date(cooldown) > new Date()) {
      return NextResponse.json(
        { error: "You are on cooldown" },
        { status: 403 }
      );
    }

    // 4. Insert reservation
    await db.query(
      `INSERT INTO Reservations 
       (SlotID, Email, RoomID, ReservationDate, CreatedAt)
       VALUES (?, ?, ?, ?, NOW())`,
      [slotId, session.user.email, roomId, date]
    );

    await db.query(
      `UPDATE Users 
      SET CooldownUntil = DATE_ADD(NOW(), INTERVAL 1 WEEK)
      WHERE Email = ?`,
      [session.user.email]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Reservation error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}