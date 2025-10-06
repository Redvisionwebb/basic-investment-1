import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const currentAge = searchParams.get("currentAge");
    const marriageAge = searchParams.get("marriageAge");
    const totalInvestment = searchParams.get("totalInvestment");
    const expectedReturn = searchParams.get("expectedReturn");
    const inflationRate = searchParams.get("inflationRate");

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/marriage-calculator`;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const url = `${apiUrl}?currentAge=${encodeURIComponent(currentAge)}&marriageAge=${encodeURIComponent(marriageAge)}&totalInvestment=${encodeURIComponent(totalInvestment)}&expectedReturn=${encodeURIComponent(expectedReturn)}&inflationRate=${encodeURIComponent(inflationRate)}&apikey=${apiKey}`;

    const response = await axios.get(url);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Marriage Calculator API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch marriage calculator data" }),
      { status: 500 }
    );
  }
}
