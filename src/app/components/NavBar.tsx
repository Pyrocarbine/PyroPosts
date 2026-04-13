"use client"
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function NavBar() {
    const { data: session } = useSession();
    const path = usePathname();
    return (
        <div className="w-full h-16 border-b bg-white text-gray-800 flex items-center justify-center px-4 relative">
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <h1 className="text-2xl font-bold">
                    <Link href="/">PyroBlog</Link>
                </h1>
            </div>
            <div className="ml-auto flex items-center gap-3">
                {session?.user && path!=="/user-posts" && <Link href="/user-posts" className="">Your Posts</Link>} 
                {session?.user ? (
                    <button
                        onClick={() => signOut()}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition text-sm cursor-pointer"
                    >
                        Sign Out
                    </button>
                    ) : (
                    <Link
                        href="/api/auth/signin"
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition text-sm cursor-pointer"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    );
}