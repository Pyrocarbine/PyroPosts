import { neon } from '@neondatabase/serverless';
import Postcard from './PostCard';
import SearchBar, { EmptySearchState, FilterablePost, SearchFilterProvider } from './SearchBar';
import { Post } from '../types/post';

const sql = neon(process.env.DATABASE_URL!);

export default async function Page() {
  const posts = await sql`SELECT * FROM posts ORDER BY created_at DESC` as Post[];
  const searchablePosts = posts.map((post) => ({
    id: post.id,
    searchValue: `${post.title.toLowerCase()} ${post.content.toLowerCase()}`,
    tags: post.tags ?? [],
  }));

  return (
    <SearchFilterProvider>
      <div className="space-y-6">
        <SearchBar />
        {posts.map((post) => (
          <FilterablePost
            key={post.id}
            searchValue={`${post.title.toLowerCase()} ${post.content.toLowerCase()}`}
            tags={post.tags ?? []}
          >
            <Postcard post={post} />
          </FilterablePost>
        ))}
        <EmptySearchState items={searchablePosts} />
      </div>
    </SearchFilterProvider>
  );
}
