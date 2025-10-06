import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const oneTimeInvestment = searchParams.get("oneTimeInvestment");
    const investmentDuration = searchParams.get("investmentDuration");
    const expectedReturn = searchParams.get("expectedReturn");

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/lumpsum-calculator`;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const url = `${apiUrl}?oneTimeInvestment=${encodeURIComponent(oneTimeInvestment)}&investmentDuration=${encodeURIComponent(investmentDuration)}&expectedReturn=${encodeURIComponent(expectedReturn)}&apikey=${apiKey}`;

    const response = await axios.get(url);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Lumpsum Calculator API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch lumpsum calculator data" }),
      { status: 500 }
    );
  }
}
