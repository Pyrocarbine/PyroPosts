import { neon } from '@neondatabase/serverless';
import Postcard from './PostCard';
import SearchBar from './SearchBar';
import { Post } from '../types/post';

const sql = neon(process.env.DATABASE_URL!);

export default async function Page({ searchParams }: { searchParams?: { q?: string } }) {
  const q = (await searchParams)?.q ?? '';
  let posts: Post[];

  if (q && q.trim() !== '') {
    posts = await sql`SELECT * FROM posts WHERE title ILIKE ${'%' + q + '%'} or content ILIKE ${'%' + q + '%'} ORDER BY created_at DESC` as Post[];
  } else {
    posts = await sql`SELECT * FROM posts ORDER BY created_at DESC` as Post[];
  }

  return (
    <div className="space-y-6">
      <SearchBar />
      {posts.map((post) => (
        <Postcard key={post.id} post={post} />
      ))}
    </div>
  );
}
