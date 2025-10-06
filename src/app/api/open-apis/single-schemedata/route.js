import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();
    const { pcode } = body;

    if (!pcode) {
      return new Response(JSON.stringify({ error: "Missing pcode" }), {
        status: 400,
      });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/single-schemedata?apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

    const response = await axios.post(apiUrl, { pcode });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Error in single-schemedata proxy:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch scheme data" }),
      { status: 500 }
    );
  }
}
