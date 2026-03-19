"use client"

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function NavBar() {
    const {data: session} = useSession();

    return (
        <nav className="bg-red-600 text-white w-full py-4 px-8 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold">LC Breakout Rooms</h1>
            <div className="flex gap-6">
                <Link href="/" className="hover:underline hover:text-red-100 transition-colors">
                    Home 
                </Link>
                <Link href="/admin/login" className="hover:underline hover:text-red-100 transition-colors">
                    Admin Login Form
                </Link>

               {
               session ? (
                    <button
                        onClick={() => signOut()}
                        className="bg-white text-[#ff0000] px-3 py-1 rounded-md font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Sign Out
                    </button>
                ) : (
                    <button
                        onClick={() => signIn()}
                        className="bg-white text-[#ff0000] px-3 py-1 rounded-md font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Sign In
                    </button>
                )
                }

            </div>
        </nav>
    );
}