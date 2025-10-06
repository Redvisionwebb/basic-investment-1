import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const monthlyInvestment = searchParams.get("monthlyInvestment");
    const investmentDuration = searchParams.get("investmentDuration");
    const expectedReturn = searchParams.get("expectedReturn");
    const annualStepupPercentage = searchParams.get("annualStepupPercentage");

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/stepup-calculator`;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const fullUrl = `${apiUrl}?monthlyInvestment=${encodeURIComponent(
      monthlyInvestment
    )}&investmentDuration=${encodeURIComponent(
      investmentDuration
    )}&expectedReturn=${encodeURIComponent(
      expectedReturn
    )}&annualStepupPercentage=${encodeURIComponent(
      annualStepupPercentage
    )}&apikey=${apiKey}`;

    const response = await axios.get(fullUrl);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Step-up Calculator API Error:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Step-up calculator data" }),
      { status: 500 }
    );
  }
}
