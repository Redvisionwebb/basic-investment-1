import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const response = await fetch('https://redvisionweb.com/api/category', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensures fresh data on every request (optional)
    });

    if (!response.ok) {
      throw new Error(`External API Error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}