import Page from './components/posts';
import CreatePostButton from './components/CreatePostsButton';
import { auth } from "./auth"
 

export default async function Home() {
  const session = await auth();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-4xl font-bold text-gray-900 mb-8">
          {session?.user ? "Welcome back to PyroBlog, " + session.user.name : "Welcome to PyroBlog"}
        </div>
        <CreatePostButton text="Sign in to post new blogs"/>
        <Page />
      </div>
    </div>
  );
} 
