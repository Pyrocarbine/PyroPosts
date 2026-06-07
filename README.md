This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# PyroPosts

PyroPosts is a full-stack blogging platform built with Next.js and React. It lets authenticated users create rich-text posts, attach tags, upload inline images, browse all published posts, search by title or content, view post details, and generate AI summaries for each article.

## Overview

The application is organized around three main experiences:

1. A public home feed that lists the latest posts.
2. A post editor for signed-in users, powered by TipTap.
3. Individual post pages with metadata, rendered content, image handling, and an AI-generated summary.

Authentication is handled with NextAuth, and the app stores user session data in Postgres via the Auth.js tables defined in `src/app/db/schema.sql`. Blog content is also persisted in Postgres through the Neon serverless driver. Images are uploaded to S3 and served back through signed URLs.

## Features

- Google and GitHub sign-in through NextAuth.
- Public post feed sorted by newest first.
- Rich-text post creation with TipTap.
- Inline image uploads backed by AWS S3.
- Multi-select tags for categorizing content.
- Post detail pages with author info, date, tags, and rendered HTML content.
- AI-generated summaries for reading quick overviews.
- Search and filtering across title, content, and tags.
- User-specific post management, including deletion of owned posts.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4 and DaisyUI
- NextAuth 5 beta
- Neon serverless Postgres
- AWS S3 and signed URLs
- TipTap editor with image resizing support
- OpenAI API for summarization
- Zod for schema validation helpers
- Lucide React for icons

## Architecture

### Routing and rendering

The app uses the Next.js App Router with a mix of server and client components.

- `src/app/page.tsx` loads the public feed and greets signed-in users.
- `src/app/post/[id]/page.tsx` fetches a single post and renders the full article view.
- `src/app/new-post/page.tsx` contains the post editor for authenticated users.
- `src/app/user-posts/page.tsx` lists the current user’s posts and shows delete controls.
- `src/app/layout.tsx` provides the global shell, fonts, session provider, and navigation.

### Data flow

- The feed and user pages query Postgres directly with the Neon serverless client.
- Post creation submits JSON to `src/app/api/make-post/route.ts`, which inserts a new record.
- Post details are served from `src/app/api/get-post-content/[id]/route.ts`.
- Deletion is handled by `src/app/api/delete-post/[id]/route.ts`.
- Image uploads go through `src/app/api/upload-url/route.ts`, which stores the file in S3 and returns a signed URL.
- Existing image URLs inside post HTML are re-signed before rendering so embedded images remain accessible.
- `src/app/api/summarize/route.ts` calls OpenAI to generate a short summary of post content.

### Client/server split

- Server components handle database queries and initial page rendering.
- Client components handle interactive UI such as the editor, auth-aware navigation, search state, and summary panel.
- The post editor is built with TipTap, while the post viewer safely injects stored HTML after refreshing image URLs.

## Project Structure

```text
src/app/
	api/
		auth/[...nextauth]/       NextAuth route handlers
		delete-post/[id]/         Delete a post
		get-image/                Re-sign image URLs
		get-post-content/[id]/    Fetch a single post
		make-post/                Create a new post
		summarize/                Generate AI summaries
		upload-url/               Upload images to S3
	components/                 Shared UI and editor components
	db/schema.sql               Auth.js database tables
	lib/definitions.ts          Shared validation and tag options
	new-post/page.tsx           Post editor page
	post/[id]/page.tsx          Single-post view
	user-posts/page.tsx         User-owned posts page
```

## Key Components

- `NavBar.tsx` shows sign-in/sign-out controls and links to the user’s posts.
- `CreatePostsButton.tsx` changes its destination based on auth state.
- `posts.tsx` queries the feed and wires in search and filtering.
- `PostCard.tsx` renders a feed preview with tags and the first image, if present.
- `PostContent.tsx` rehydrates stored HTML and refreshes image URLs before rendering.
- `summarizer.tsx` requests an AI summary and shows it in a dismissible panel.

## Database Model

The repository includes the Auth.js schema in `src/app/db/schema.sql` for users, accounts, sessions, and verification tokens. The blog itself also expects a `posts` table with fields such as:

- `id`
- `title`
- `content`
- `tags`
- `user_id`
- `display_name`
- `email`
- `created_at`

## Environment Variables

The app depends on external services, so local development requires environment variables for:

- Postgres connection via `DATABASE_URL`
- NextAuth provider credentials and auth secret
- AWS access keys for S3 uploads
- OpenAI API access for summaries

The code also references `NEXT_PUBLIC_BASE_URL` when fetching a post on the server side.
