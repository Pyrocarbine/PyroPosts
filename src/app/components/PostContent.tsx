import * as cheerio from "cheerio";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-east-1", credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }, });


async function regenerateImageUrls(html: string): Promise<string> {
  const $ = cheerio.load(html);

  const imgTags = $("img");

  for (let i = 0; i < imgTags.length; i++) {
    const el = imgTags[i];
    const oldUrl = $(el).attr("src");

    if (!oldUrl) continue;

    const match = new URL(oldUrl).pathname.substring(1);
    if (!match) continue;

    const command = new GetObjectCommand({
      Bucket: "pyroblog-pictures",
      Key: match,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    if (!url) continue;

    // Replace old src with new signed URL
    $(el).attr("src", url);
  }

  return $.html(); // return the updated HTML
}

type Props = {
  content: string;
  isPreview?: boolean;
};

export default async function PostContent({ content, isPreview = false }: Props) {
  let html = await regenerateImageUrls(content);

  if (isPreview) {
    // Load HTML into Cheerio
    const $ = cheerio.load(html);
    // Remove all <img> tags
    $("img").remove();
    html = $.html();
  }

  return (
    <div
      className={`post-content text-lg leading-relaxed ${isPreview ? 'line-clamp-2' : ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}