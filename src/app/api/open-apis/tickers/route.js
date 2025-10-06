// app/api/your-endpoint/route.js or route.ts

import axios from 'axios';

export async function GET(request) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/tickers`,
      {
        params: {
          apikey: process.env.NEXT_PUBLIC_API_KEY,
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API Fetch Error:', error);

    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
