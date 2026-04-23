"use client"

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function NavBar() {
    const {data: session} = useSession();

    return (
        <nav className="bg-[#e50000] text-white w-full py-4 px-8 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold">LC Breakout Rooms</h1>
            <div className="flex gap-8 items-center">
                <Link href="/" className="hover:underline hover:text-white font-bold transition-colors">
                    Home 
                </Link>
                {session?.user?.role === "admin" && (
                    <Link href="/admin/login" className="hover:underline hover:text-white font-bold transition-colors">
                        Admin Dashboard
                    </Link>
                )}

               {
               session ? (
                    <button
                        onClick={() => signOut()}
                        className="bg-white text-[#e50000] px-3 py-1 rounded-md font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Sign Out
                    </button>
                ) : (
                    <button
                        onClick={() => signIn()}
                        className="bg-white text-[#e50000] px-3 py-1 rounded-md font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Sign In
                    </button>
                )
                }

            </div>
        </nav>
    );
}