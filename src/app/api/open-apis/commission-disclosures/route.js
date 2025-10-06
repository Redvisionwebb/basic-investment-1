import axios from "axios";

export async function GET() {
  try {
    // Build full URL with API key directly in the string
    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/commission-disclosures?apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

    // Call external API
    const response = await axios.get(apiUrl);

    // Return the JSON response
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Error fetching commission disclosures:", error.message);

    return new Response(
      JSON.stringify({ error: "Failed to fetch commission disclosures" }),
      { status: 500 }
    );
  }
}
