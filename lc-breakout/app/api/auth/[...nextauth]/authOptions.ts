// authOptions.ts is required for NextAuth
// This file specifies how users should login, how sessions are handled, and which providers are

import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { RowDataPacket } from "mysql2";
import db from "@/app/lib/db";

const ADMIN_EMAILS = ["nsamal@stu.naperville203.org", "hhliu@stu.naperville203.org"];
const ADMIN_EMAIL_ALLOWLIST = new Set(ADMIN_EMAILS.map((email) => email.toLowerCase()));

export const authOptions: NextAuthOptions = {
    // Specify the login providers that can be used
    // While we just used Google, you can use as many login providers as you want
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    // Our session information is stored in a JSON web token (JWT) and stored in a cookie
    // This is a common way of storing session information, alternatively you could store session information in a database
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;

            try {
                // Check if user already exists
                const [rows] = await db.query<RowDataPacket[]>(
                    `SELECT CooldownUntil FROM User WHERE Email = ?`,
                    [user.email]
                );

                if (rows.length === 0) {
                    // New user - insert into database
                    const userName = user.name || user.email;
                    await db.query(
                        `INSERT INTO User (GoogleID, Email, Name, CreatedAt, IsAdmin)
                         VALUES (?, ?, ?, NOW(), FALSE)`,
                        [user.id, user.email, userName]
                    );

                    // Check if there are any reservations under this name
                    if (userName) {
                        const [reservations] = await db.query<RowDataPacket[]>(
                            `SELECT COUNT(*) as count FROM Reservation WHERE Email = ? LIMIT 1`,
                            [userName] // Try to find reservations where Email field matches the name
                        );

                        // Also check if name appears in User table (admin-created entries)
                        const [nameMatches] = await db.query<RowDataPacket[]>(
                            `SELECT ReservationID FROM Reservation r
                             INNER JOIN User u ON r.Email = u.Email
                             WHERE u.Name = ? LIMIT 1`,
                            [userName]
                        );

                        // If pre-existing reservations found, apply cooldown (unless user is admin)
                        if ((reservations[0].count > 0 || nameMatches.length > 0) && !ADMIN_EMAIL_ALLOWLIST.has(user.email?.toLowerCase() || "")) {
                            await db.query(
                                `UPDATE User 
                                 SET CooldownUntil = DATE_ADD(NOW(), INTERVAL 3 DAY)
                                 WHERE Email = ?`,
                                [user.email]
                            );
                        }
                    }
                }

                return true;
            } catch (error) {
                console.error("Sign-in error for", user.email, error);
                return false;
            }
            },

        async jwt({ token, user }) {
            if (user) {
                const name = user.name || "";
                const email = user.email || "";
                const normalizedEmail = email.toLowerCase();
                
                try {
                    // Check if user is an admin in the database
                    const [rows] = await db.query<RowDataPacket[]>(
                        `SELECT IsAdmin FROM User WHERE Email = ? LIMIT 1`,
                        [normalizedEmail]
                    );

                    const isAdminInDb = rows.length > 0 && rows[0].IsAdmin;

                    // Admin: check database IsAdmin column first, then fallback to email allowlist
                    if (isAdminInDb || ADMIN_EMAIL_ALLOWLIST.has(normalizedEmail)) {
                        token.role = "admin";
                    }
                    // Teacher: email contains "naperville203" but not "stu.naperville203"
                    else if (normalizedEmail.includes("naperville203") && !normalizedEmail.includes("stu.naperville203")) {
                        token.role = "teacher";
                    }
                    // Student: email contains "stu.naperville203"
                    else if (normalizedEmail.includes("stu.naperville203")) {
                        token.role = "student";
                    }
                    
                    token.email = normalizedEmail;
                    token.name = name;
                } catch (error) {
                    console.error("JWT callback error:", error);
                    token.email = normalizedEmail;
                    token.name = name;
                    token.role = "student"; // Default to student on error
                }
            }
            return token;
        },
        async session({ session, token }) {
            // Add role and user info to session
            if (session.user) {
                session.user.role = token.role as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        }
    }
};