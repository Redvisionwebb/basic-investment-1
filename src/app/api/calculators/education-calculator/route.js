import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const currentAge = searchParams.get("currentAge");
    const educationAge = searchParams.get("educationAge");
    const totalInvestment = searchParams.get("totalInvestment");
    const expectedReturn = searchParams.get("expectedReturn");
    const inflationRate = searchParams.get("inflationRate");

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/education-calculator`;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const url = `${apiUrl}?currentAge=${encodeURIComponent(currentAge)}&educationAge=${encodeURIComponent(educationAge)}&totalInvestment=${encodeURIComponent(totalInvestment)}&expectedReturn=${encodeURIComponent(expectedReturn)}&inflationRate=${encodeURIComponent(inflationRate)}&apikey=${apiKey}`;

    const response = await axios.get(url);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Education Calculator API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch education calculator data" }),
      { status: 500 }
    );
  }
}
