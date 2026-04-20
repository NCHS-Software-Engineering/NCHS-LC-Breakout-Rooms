import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "@/app/lib/db";
import { requireAdminSession } from "@/app/api/admin/_lib/auth";

type UserRow = RowDataPacket & {
  email: string;
  name: string | null;
  cooldownEndsAt: string | null;
};

const ADMIN_EMAILS = ["nsamal@stu.naperville203.org", "hhliu@stu.naperville203.org"];
const ADMIN_EMAIL_ALLOWLIST = new Set(ADMIN_EMAILS.map((email) => email.toLowerCase()));

function getUserRole(email: string): "admin" | "teacher" | "student" {
  const normalizedEmail = email.toLowerCase();
  
  if (ADMIN_EMAIL_ALLOWLIST.has(normalizedEmail)) {
    return "admin";
  } else if (normalizedEmail.includes("naperville203") && !normalizedEmail.includes("stu.naperville203")) {
    return "teacher";
  } else if (normalizedEmail.includes("stu.naperville203")) {
    return "student";
  }
  
  return "student"; // Default to student for external emails
}

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
    const cooldownFilter = url.searchParams.get("cooldownFilter") || ""; // "active", "all", or empty
    const roleFilter = url.searchParams.get("roleFilter") || ""; // "admin", "student", or empty

    let sql = `
      SELECT
        Email AS email,
        Name AS name,
        CooldownUntil AS cooldownEndsAt
      FROM User
    `;
    const params: string[] = [];
    const conditions: string[] = [];

    if (query) {
      if (searchType === "id") {
        conditions.push("Email LIKE ?");
        params.push(`%${query}%`);
      } else {
        conditions.push("(Name LIKE ? OR Email LIKE ?)");
        params.push(`%${query}%`, `%${query}%`);
      }
    }

    // Add cooldown filter
    if (cooldownFilter === "active") {
      conditions.push("CooldownUntil IS NOT NULL AND CooldownUntil > NOW()");
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY Name IS NULL, Name, Email LIMIT 100";

    const [rows] = await db.query<UserRow[]>(sql, params);

    const users = rows.map((row) => {
      const emailPrefix = row.email.split("@")[0] || row.email;
      const parsedName = splitName(row.name, emailPrefix);
      const role = getUserRole(row.email);

      return {
        id: row.email,
        email: row.email,
        firstName: parsedName.firstName,
        lastName: parsedName.lastName,
        cooldownEndsAt: row.cooldownEndsAt,
        role,
      };
    }).filter((user) => {
      // Apply role filter on frontend after role determination
      if (roleFilter && roleFilter !== user.role) {
        return false;
      }
      return true;
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
