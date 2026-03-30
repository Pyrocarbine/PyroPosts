import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);

export async function DELETE(req: Request, {params}: {params: Promise<{id: string}>}) {
    const { id }  = await params;
    await sql`DELETE FROM posts WHERE id = ${id}`;
    return NextResponse.json({ success: true });
}



