import axios from 'axios';

export async function GET() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/useful-links`;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const response = await axios.get(`${apiUrl}?apikey=${apiKey}`);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Useful Links API Error:', error?.message);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch useful links' }),
      { status: 500 }
    );
  }
}
