import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "@/app/lib/db";
import { requireAdminSession } from "@/app/api/admin/_lib/auth";
import { formatTimeToAmPm } from "@/app/lib/time";

type ReservationRow = RowDataPacket & {
  id: number;
  roomNumber: number;
  email: string;
  guestName: string | null;
  date: string;
  period: string;
  slotId: number;
  startTime: string;
  endTime: string;
};

export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdminSession();
    if (errorResponse) {
      return errorResponse;
    }

    const url = new URL(req.url);
    const selectedDate = url.searchParams.get("date");

    const params: string[] = [];
    const whereClause = selectedDate ? "WHERE r.ReservationDate = ?" : "";
    if (selectedDate) {
      params.push(selectedDate);
    }

    const [rows] = await db.query<ReservationRow[]>(
      `SELECT
         r.ReservationID AS id,
         r.RoomID AS roomNumber,
         r.Email AS email,
         u.Name AS guestName,
         DATE_FORMAT(r.ReservationDate, '%Y-%m-%d') AS date,
         ts.PeriodLabel AS period,
         ts.SlotID AS slotId,
         ts.StartTime AS startTime,
         ts.EndTime AS endTime
       FROM Reservation r
       JOIN TimeSlot ts ON ts.SlotID = r.SlotID
       LEFT JOIN User u ON u.Email = r.Email
       ${whereClause}
       ORDER BY r.ReservationDate, ts.StartTime, r.RoomID`,
      params
    );

    const formatted = rows.map((row) => ({
      id: String(row.id),
      roomNumber: row.roomNumber,
      roomId: `room${row.roomNumber}`,
      email: row.email,
      guestName: row.guestName || row.email,
      date: row.date,
      period: row.period,
      slotId: row.slotId,
      startTime: formatTimeToAmPm(row.startTime),
      endTime: formatTimeToAmPm(row.endTime),
    }));

    return NextResponse.json({ reservations: formatted });
  } catch (error) {
    console.error("Admin reservations GET error:", error);
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { errorResponse } = await requireAdminSession();
    if (errorResponse) {
      return errorResponse;
    }

    const { email, guestName, roomNumber, date, slotId } = await req.json();

    if (!guestName || !roomNumber || !date || !slotId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let normalizedEmail = email ? String(email).trim().toLowerCase() : "";
    const normalizedName = String(guestName).trim();
    const normalizedRoom = Number(roomNumber);
    const normalizedSlot = Number(slotId);

    // If no email provided, try to find user by name
    if (!normalizedEmail && normalizedName) {
      const [nameMatch] = await db.query<RowDataPacket[]>(
        `SELECT Email FROM User WHERE Name = ? LIMIT 1`,
        [normalizedName]
      );
      if (nameMatch.length > 0) {
        normalizedEmail = nameMatch[0].Email;
      }
    }

    // Email is required either from input or from name lookup
    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email is required. User not found in database." }, { status: 400 });
    }

    if (!normalizedEmail.includes("@") || Number.isNaN(normalizedRoom) || Number.isNaN(normalizedSlot)) {
      return NextResponse.json({ error: "Invalid reservation data" }, { status: 400 });
    }

    const [slotRows] = await db.query<RowDataPacket[]>(
      `SELECT SlotID FROM TimeSlot WHERE SlotID = ? LIMIT 1`,
      [normalizedSlot]
    );

    if (slotRows.length === 0) {
      return NextResponse.json({ error: "Invalid period selected" }, { status: 400 });
    }

    const [conflicts] = await db.query<RowDataPacket[]>(
      `SELECT ReservationID
       FROM Reservation
       WHERE RoomID = ? AND SlotID = ? AND ReservationDate = ?
       LIMIT 1`,
      [normalizedRoom, normalizedSlot, date]
    );

    if (conflicts.length > 0) {
      return NextResponse.json({ error: "This room is already reserved for that period" }, { status: 409 });
    }

    const [userRows] = await db.query<RowDataPacket[]>(
      `SELECT Email FROM User WHERE Email = ? LIMIT 1`,
      [normalizedEmail]
    );

    if (userRows.length === 0) {
      await db.query(
        `INSERT INTO User (GoogleID, Email, Name, CreatedAt)
         VALUES (?, ?, ?, NOW())`,
        [null, normalizedEmail, normalizedName || normalizedEmail]
      );
    } else if (normalizedName) {
      await db.query(
        `UPDATE User SET Name = ? WHERE Email = ?`,
        [normalizedName, normalizedEmail]
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO Reservation (SlotID, Email, RoomID, ReservationDate, CreatedAt)
       VALUES (?, ?, ?, ?, NOW())`,
      [normalizedSlot, normalizedEmail, normalizedRoom, date]
    );

    return NextResponse.json({ success: true, reservationId: result.insertId });
  } catch (error) {
    console.error("Admin reservations POST error:", error);
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { errorResponse } = await requireAdminSession();
    if (errorResponse) {
      return errorResponse;
    }

    const url = new URL(req.url);
    const reservationId = Number(url.searchParams.get("reservationId"));

    if (Number.isNaN(reservationId) || reservationId <= 0) {
      return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
    }

    // First, get the user's email from the reservation
    const [reservationRows] = await db.query<RowDataPacket[]>(
      `SELECT Email FROM Reservation WHERE ReservationID = ?`,
      [reservationId]
    );

    if (reservationRows.length === 0) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    const userEmail = reservationRows[0].Email;

    // Delete the reservation
    const [result] = await db.query<ResultSetHeader>(
      `DELETE FROM Reservation WHERE ReservationID = ?`,
      [reservationId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    // Reset the user's cooldown to 3 minutes
    await db.query(
      `UPDATE User SET CooldownUntil = DATE_ADD(NOW(), INTERVAL 3 MINUTE) WHERE Email = ?`,
      [userEmail]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin reservations DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete reservation" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { errorResponse } = await requireAdminSession();
    if (errorResponse) {
      return errorResponse;
    }

    const { reservationId, email, roomNumber, slotId, date } = await req.json();

    if (!reservationId || !email || !roomNumber || !slotId || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedRoom = Number(roomNumber);
    const normalizedSlot = Number(slotId);
    const reservationIdNum = Number(reservationId);

    if (!normalizedEmail.includes("@") || Number.isNaN(normalizedRoom) || Number.isNaN(normalizedSlot) || Number.isNaN(reservationIdNum)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Check if reservation exists
    const [existingReservation] = await db.query<RowDataPacket[]>(
      `SELECT ReservationID FROM Reservation WHERE ReservationID = ?`,
      [reservationIdNum]
    );

    if (existingReservation.length === 0) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    // Check if the new slot/room combination is already taken (excluding current reservation)
    const [conflicts] = await db.query<RowDataPacket[]>(
      `SELECT ReservationID FROM Reservation 
       WHERE RoomID = ? AND SlotID = ? AND ReservationDate = ? AND ReservationID != ?`,
      [normalizedRoom, normalizedSlot, date, reservationIdNum]
    );

    if (conflicts.length > 0) {
      return NextResponse.json({ error: "This room is already reserved for that period" }, { status: 409 });
    }

    // Update the reservation
    await db.query(
      `UPDATE Reservation SET Email = ?, RoomID = ?, SlotID = ?, ReservationDate = ? WHERE ReservationID = ?`,
      [normalizedEmail, normalizedRoom, normalizedSlot, date, reservationIdNum]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin reservations PATCH error:", error);
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 });
  }
}
