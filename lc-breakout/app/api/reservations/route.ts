import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import db from "@/app/lib/db";

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
    const existing = await db.query(
      `SELECT * FROM Reservations
       WHERE RoomID = ? 
       AND SlotID = ? 
       AND ReservationDate = ?`,
      [roomId, slotId, date]
    );


    console.log("EXISTING RESULT:", existing);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "This room is already reserved" },
        { status: 409 }
      );
    }

    // 4. Insert reservation
    await db.query(
      `INSERT INTO Reservations 
       (SlotID, Email, RoomID, ReservationDate, CreatedAt)
       VALUES (?, ?, ?, ?, NOW())`,
      [slotId, session.user.email, roomId, date]
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