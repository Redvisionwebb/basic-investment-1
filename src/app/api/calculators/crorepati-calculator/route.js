import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const currentAge = searchParams.get("currentAge");
    const crorepatiAge = searchParams.get("crorepatiAge");
    const targetedWealth = searchParams.get("targetedWealth");
    const currentSavings = searchParams.get("currentSavings");
    const expectedReturn = searchParams.get("expectedReturn");
    const inflationRate = searchParams.get("inflationRate");

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/crorepati-calculator`;

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    // Build full URL with encoded parameters
    const url = `${apiUrl}?currentAge=${encodeURIComponent(currentAge)}&crorepatiAge=${encodeURIComponent(crorepatiAge)}&targetedWealth=${encodeURIComponent(targetedWealth)}&currentSavings=${encodeURIComponent(currentSavings)}&expectedReturn=${encodeURIComponent(expectedReturn)}&inflationRate=${encodeURIComponent(inflationRate)}&apikey=${apiKey}`;

    const response = await axios.get(url);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Crorepati Calculator API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch crorepati calculator data" }),
      { status: 500 }
    );
  }
}
