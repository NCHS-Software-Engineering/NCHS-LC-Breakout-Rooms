"use client"

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function NavBar() {
    const {data: session} = useSession();

    return (
        <nav className="bg-[#e50000] text-white w-full px-4 py-3 shadow-md sm:px-6" aria-label="Main navigation">
            <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3">
                <Link href="/" className="text-lg font-bold sm:text-xl hover:text-white transition-colors">
                    <span className="sr-only">LC Breakout Rooms - </span>
                    LC Breakout Rooms
                </Link>
                <div className="flex flex-wrap items-center gap-3 sm:gap-6" role="toolbar" aria-label="User actions">
                <Link href="/" className="hover:underline hover:text-white font-bold transition-colors" aria-current="page">
                    Home 
                </Link>
                {session?.user?.role === "admin" && (
                    <Link href="/admin/dashboard" className="hover:underline hover:text-white font-bold transition-colors">
                        Admin Dashboard
                    </Link>
                )}

               {
               session ? (
                    <button
                        onClick={() => signOut()}
                        className="bg-white text-[#e50000] px-3 py-1 rounded-md font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                        aria-label="Sign out of your account"
                    >
                        Sign Out
                    </button>
                ) : (
                    <button
                        onClick={() => signIn()}
                        className="bg-white text-[#e50000] px-3 py-1 rounded-md font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                        aria-label="Sign in to your account"
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