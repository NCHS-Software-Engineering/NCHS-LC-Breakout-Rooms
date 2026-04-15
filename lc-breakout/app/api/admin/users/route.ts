import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "@/app/lib/db";
import { requireAdminSession } from "@/app/api/admin/_lib/auth";

type UserRow = RowDataPacket & {
  email: string;
  name: string | null;
  cooldownEndsAt: string | null;
};

function splitName(name: string | null, fallback: string) {
  const value = (name || "").trim();

  if (!value) {
    return {
      firstName: fallback,
      lastName: "",
    };
  }

  const [firstName, ...rest] = value.split(/\s+/);
  return {
    firstName,
    lastName: rest.join(" "),
  };
}

export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdminSession();
    if (errorResponse) {
      return errorResponse;
    }

    const url = new URL(req.url);
    const query = (url.searchParams.get("query") || "").trim();
    const searchType = url.searchParams.get("searchType") === "id" ? "id" : "name";

    let sql = `
      SELECT
        Email AS email,
        Name AS name,
        CooldownUntil AS cooldownEndsAt
      FROM User
    `;
    const params: string[] = [];

    if (query) {
      if (searchType === "id") {
        sql += " WHERE Email LIKE ? ";
        params.push(`%${query}%`);
      } else {
        sql += " WHERE Name LIKE ? OR Email LIKE ? ";
        params.push(`%${query}%`, `%${query}%`);
      }
    }

    sql += " ORDER BY Name IS NULL, Name, Email LIMIT 100";

    const [rows] = await db.query<UserRow[]>(sql, params);

    const users = rows.map((row) => {
      const emailPrefix = row.email.split("@")[0] || row.email;
      const parsedName = splitName(row.name, emailPrefix);

      return {
        id: row.email,
        email: row.email,
        firstName: parsedName.firstName,
        lastName: parsedName.lastName,
        cooldownEndsAt: row.cooldownEndsAt,
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { errorResponse } = await requireAdminSession();
    if (errorResponse) {
      return errorResponse;
    }

    const { userId, days } = await req.json();
    const cooldownDays = Number(days);

    if (!userId || Number.isNaN(cooldownDays) || cooldownDays <= 0) {
      return NextResponse.json({ error: "Invalid cooldown request" }, { status: 400 });
    }

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE User
       SET CooldownUntil = DATE_ADD(NOW(), INTERVAL ? DAY)
       WHERE Email = ?`,
      [cooldownDays, userId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [updatedRows] = await db.query<RowDataPacket[]>(
      `SELECT CooldownUntil AS cooldownEndsAt FROM User WHERE Email = ? LIMIT 1`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      cooldownEndsAt: updatedRows[0]?.cooldownEndsAt || null,
    });
  } catch (error) {
    console.error("Admin users PATCH error:", error);
    return NextResponse.json({ error: "Failed to update user cooldown" }, { status: 500 });
  }
}
