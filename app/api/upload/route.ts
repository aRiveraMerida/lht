import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf',
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .slice(0, 200);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!process.env.UPLOAD_SECRET) {
    return NextResponse.json({ error: 'Upload not configured' }, { status: 503 });
  }

  if (authHeader !== `Bearer ${process.env.UPLOAD_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: `File type not allowed: ${file.type}` }, { status: 400 });
  }

  const safeName = sanitizeFilename(file.name);

  const blob = await put(safeName, file, { access: 'public' });

  return NextResponse.json({ url: blob.url });
}
