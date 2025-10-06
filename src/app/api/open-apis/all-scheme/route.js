import axios from "axios";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fund = searchParams.get("fund");

    if (!fund) {
      return new Response(JSON.stringify({ error: "Missing fund parameter" }), {
        status: 400,
      });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/all-scheme?fund=${encodeURIComponent(
      fund
    )}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

    const response = await axios.get(apiUrl);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching all schemes:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch all schemes" }),
      { status: 500 }
    );
  }
}
