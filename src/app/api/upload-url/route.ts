import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "../../auth";

const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ success: false, error: "User is not signed in. Please sign in to make new posts"}, { status: 500 });
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    const fileName = `${Date.now()}-${file.name}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    await s3Client.send(
        new PutObjectCommand({
        Bucket: "pyroblog-pictures",
        Key: fileName,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
        })
    );

    const getCommand = new GetObjectCommand({
        Bucket: "pyroblog-pictures",
        Key: fileName
    })

    const getUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 60 * 5});
    return NextResponse.json({ success: true, getUrl }, {status: 200});
}