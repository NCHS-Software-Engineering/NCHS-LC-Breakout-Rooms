import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions"; // relative path
import db from "../../lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT CooldownUntil FROM Users WHERE Email = ?`,
      [session.user.email]
    );

    return NextResponse.json(rows[0] || { CooldownUntil: null });
  } catch (err) {
    console.error("API /user error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}