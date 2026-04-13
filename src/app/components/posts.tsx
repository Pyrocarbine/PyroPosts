import { neon } from '@neondatabase/serverless';
import Postcard from './PostCard';
import { Post } from '../types/post';

const sql = neon(process.env.DATABASE_URL!);

export default async function Page() {
  // Don't await the data fetching function
    const posts = await sql`SELECT * FROM posts` as Post[];

    return (
        <div className="space-y-6">
        {posts.map((post) => (
            <Postcard key={post.id} post={post} />
        ))}
        </div>
    )
}
