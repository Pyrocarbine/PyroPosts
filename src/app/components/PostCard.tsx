import Link from "next/link";
import Image from "next/image";
import { Post } from "../types/post";
import logo from "./logo.png";

import * as cheerio from "cheerio";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import PostContent from "./PostContent";

const s3 = new S3Client({ region: "us-east-1", credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }, });

async function fetchFirstImage(content : string): Promise<string | null>{
  const contentHTML = cheerio.load(content);

  const images = contentHTML("img");
  if (images.length === 0) return null;
  const imageUrl = contentHTML(images[0]).attr("src");
  if (!imageUrl) return null;
  const match = new URL(imageUrl).pathname.substring(1);
  const command = new GetObjectCommand({
    Bucket: "pyroblog-pictures",
    Key: match
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 300 });
  if (!url) return null;

  return url;
}

export default async function PostCard({ post }: { post: Post }) {
  const imageUrl = await fetchFirstImage(post.content.toString());
  return (
    <Link href={`/post/${post.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 mb-5 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
          <p className="text-sm text-gray-600 mb-4"> Created by {post.display_name} · {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric"})}</p>
          <PostContent content={post.content} isPreview={true} />
        </div>
        <div className="w-full md:w-48 h-32 flex-shrink-0">
          {imageUrl ? (
              <div className="w-full h-full relative">
                <Image
                  src={imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover rounded-lg"
                />
            </div>
            ) : null}
        </div>
      </div>
    </Link>
  );
}
