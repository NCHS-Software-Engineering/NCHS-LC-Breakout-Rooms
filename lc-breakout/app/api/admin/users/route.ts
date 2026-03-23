import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: NextRequest) {
  try {
    const searchQuery = request.nextUrl.searchParams.get("q");

    const connection = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    let query = `
      SELECT DISTINCT Email as id, SUBSTRING_INDEX(Email, '@', 1) as name
      FROM Reservations
      WHERE ReservationDate >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
    `;

    const params: string[] = [];

    if (searchQuery && searchQuery.trim()) {
      query += ` AND Email LIKE ?`;
      params.push(`%${searchQuery}%`);
    }

    query += ` ORDER BY Email ASC`;

    const [users] = await connection.execute(query, params);

    await connection.end();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userID, email } = body;
    const userEmail = email ?? userID;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const connection = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Delete all reservations for this user
    const result = await connection.execute(
      `DELETE FROM Reservations WHERE Email = ?`,
      [userEmail]
    );

    await connection.end();

    return NextResponse.json(
      { 
        success: true, 
        message: `Deleted all reservations for user ${userEmail}`,
        deletedCount: (result[0] as any).affectedRows
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
