import { auth } from '../auth';
import CreatePostButton from '../components/CreatePostsButton';
import { neon } from '@neondatabase/serverless';
import { Post } from '../types/post';
import PostCard from '../components/PostCard';
import DeleteButton from '../components/DeleteButton';

export default async function Home() {
  const sql = neon(process.env.DATABASE_URL!);
  const session = await auth();

  const posts = (await sql`SELECT * FROM posts`) as Post[];

  if (!session?.user?.id) {
    return (
      <>
        <div className="text-center text-xl mb-5">
          Error: User is not Signed In
        </div>
        <CreatePostButton text="Sign in to view your blogs" />
      </>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      {posts.map(
        (post) =>
          post.user_id == session?.user?.id && (
            <div key={post.id} className="relative w-full max-w-4xl group">
              <PostCard post={post} />
              <div className="hidden group-hover:block ">
                <DeleteButton postId={post.id} />
              </div>
            </div>
          )
      )}
    </div>
  );
}