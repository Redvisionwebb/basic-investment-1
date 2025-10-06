import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const monthlyInvestment = searchParams.get("monthlyInvestment");
    const investmentDuration = searchParams.get("investmentDuration");
    const expectedReturn = searchParams.get("expectedReturn");
    const delayInMonths = searchParams.get("delayInMonths");

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/delay-calculator`;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const url = `${apiUrl}?monthlyInvestment=${encodeURIComponent(monthlyInvestment)}&investmentDuration=${encodeURIComponent(investmentDuration)}&expectedReturn=${encodeURIComponent(expectedReturn)}&delayInMonths=${encodeURIComponent(delayInMonths)}&apikey=${apiKey}`;

    const response = await axios.get(url);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Delay Calculator API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch delay calculator data" }),
      { status: 500 }
    );
  }
}
