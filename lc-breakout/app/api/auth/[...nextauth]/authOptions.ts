// authOptions.ts is required for NextAuth
// This file specifies how users should login, how sessions are handled, and which providers are

import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth";

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
        async jwt({ token, user }) {
            if (user) {
                const name = user.name || "";
                const email = user.email || "";
                
                // Admin: name is "gottlieb"
                if (name.toLowerCase().includes("gottlieb")) {
                    token.role = "admin";
                }
                // Teacher: email contains "naperville203" but not "stu.naperville203"
                else if (email.includes("naperville203") && !email.includes("stu.naperville203")) {
                    token.role = "teacher";
                }
                // Student: email contains "stu.naperville203"
                else if (email.includes("stu.naperville203")) {
                    token.role = "student";
                }
                
                token.email = email;
                token.name = name;
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