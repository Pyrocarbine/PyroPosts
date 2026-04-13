import { neon } from '@neondatabase/serverless';
import { Post } from '../../../types/post';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: Request, {params}: {params: Promise<{id: string}>}): Promise<Response> {
    const { id } = await params;
    const postId = Number(id);
    const [post] = (await sql`
        SELECT title, content, display_name, created_at
        FROM posts
        WHERE id = ${postId}
    `) as Post[];
    if (!post) {
        return Response.json({ error: "Post not found" }, { status: 404 });
    }
    return Response.json(post)

}