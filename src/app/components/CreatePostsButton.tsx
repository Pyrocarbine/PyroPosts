import { auth } from "../auth";
import Link from "next/link";

export default async function CreatePostButton({text}:{text: string}) {
    const session = await auth();
    if (!session?.user) return (
        <Link 
            href="/api/auth/signin" 
            className="inline-block px-6 py-3 mb-5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 text-center"
        >
            {text}
        </Link>
    );
    return (
        <Link
            href="/new-post"
            className="inline-block px-6 py-3 mb-5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
        >
            Create New Blog
        </Link>
    );
}