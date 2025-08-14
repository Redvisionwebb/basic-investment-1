import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';


export async function POST(req) {
  const formData = await req.formData();

  const section = formData.get('section');
  const file = formData.get('image');

  if (!section || !file || typeof file === 'string') {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), 'public/uploads', section);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filepath, buffer);

  return NextResponse.json({
    filename,
    url: `/uploads/${section}/${filename}`,
  });
}


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get('section'); // testimonials, blogs etc
  const filename = searchParams.get('filename'); // myimage.jpg  
  if (!section || !filename) {
    return new Response("Invalid request", { status: 400 });
  }

  const filePath = path.join(process.cwd(), process.env.UPLOAD_URL, section, filename);

  if (!fs.existsSync(filePath)) {
    return new Response("Not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const contentType = `image/${path.extname(filename).slice(1) || 'jpeg'}`;

  return new Response(fileBuffer, {
    headers: {
      'Content-Type': contentType
    }
  });
}

