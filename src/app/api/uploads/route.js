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
  const section = searchParams.get('section'); // e.g., 'blogs', 'testimonials'
  const filename = searchParams.get('filename'); // e.g., 'myimage.svg'
  // Validate input
  if (!section || !filename) {
    return new Response("Invalid request", { status: 400 });
  }

  // Construct full file path
  const filePath = path.join(process.cwd(), process.env.UPLOAD_URL, section, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return new Response("Not found", { status: 404 });
  }

  // Read the file
  const fileBuffer = fs.readFileSync(filePath);

  // Determine Content-Type based on file extension
  let ext = path.extname(filename).toLowerCase();
  let contentType = 'application/octet-stream'; // fallback MIME type

  if (ext === '.svg') {
    contentType = 'image/svg+xml';
  } else if (ext === '.jpg' || ext === '.jpeg') {
    contentType = 'image/jpeg';
  } else if (ext === '.png') {
    contentType = 'image/png';
  } else if (ext === '.webp') {
    contentType = 'image/webp';
  } else if (ext === '.gif') {
    contentType = 'image/gif';
  } else if (ext === '.ico') {
    contentType = 'image/x-icon';
  }
  // Return the file with the appropriate content-type
  return new Response(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000', // optional: cache images
    },
  });
}
