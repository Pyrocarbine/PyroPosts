import { Post } from '../../types/post';
import PostContent from "../../components/PostContent";
import Summarizer from '../../components/summarizer';
import { options } from "../../lib/definitions";

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
                    <p className="text-lg text-gray-600 mb-2">Created by {post.display_name.toString()}{post.email && (
                        <> (<a href={`mailto:${post.email}`}>{post.email}</a>)</>
                    )} on {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric"})}</p>
                    {post?.tags && post?.tags?.length > 0 && (
                        <div className="mb-2">
                            {post.tags.map((tag, index) => {
                                const tag_label = options.find(
                                    (option) => option.value === tag
                                )?.label;

                                if (!tag_label) return null;
                                return (
                                    <span
                                    key={index}
                                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2"
                                    >
                                    {tag_label}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                    <PostContent content={post.content.toString()} />
                    <Summarizer content={post.content.toString()} />
                </article>
            </div>
        </div>
    );
}