// app/api/all-amc/route.js

import axios from "axios";

export async function GET() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/all-amc?apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

    const response = await axios.get(apiUrl);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Error fetching AMC data:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch AMC data" }), {
      status: 500,
    });
  }
}
