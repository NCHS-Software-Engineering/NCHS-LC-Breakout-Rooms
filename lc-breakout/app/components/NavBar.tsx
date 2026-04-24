"use client"

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function NavBar() {
    const {data: session} = useSession();

    return (
        <nav className="bg-[#e50000] text-white w-full px-4 py-3 shadow-md sm:px-6">
            <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3">
                <h1 className="text-lg font-bold sm:text-xl">LC Breakout Rooms</h1>
                <div className="flex flex-wrap items-center gap-3 sm:gap-6">
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
            </div>
        </nav>
    );
}