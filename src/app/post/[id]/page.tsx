import { Post } from '../../types/post';
import PostContent from "../../components/PostContent";
import Summarizer from '../../components/Summarizer';

export default async function getPost({ params } : {params: Promise<{id: string}>}) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const { id } = await params;
    const response = await fetch(`${baseUrl}/api/get-post-content/${id}`, { method: "GET"});
    const post : Post = await response.json().catch((error) => {
        console.error("Error fetching post content:", error);
        return null;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <article className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title.toString()}</h1>
                    <p className="text-lg text-gray-600 mb-8">Created by {post.display_name.toString()} on {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric"})}</p>
                    <PostContent content={post.content.toString()} />
                    <Summarizer content={post.content.toString()} />
                </article>
            </div>
        </div>
    );
}