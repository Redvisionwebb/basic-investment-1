import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const loanAmount = searchParams.get("loanAmount");
    const loanTenure = searchParams.get("loanTenure");
    const interestRate = searchParams.get("interestRate");

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/emi-calculator`;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const url = `${apiUrl}?loanAmount=${encodeURIComponent(loanAmount)}&loanTenure=${encodeURIComponent(loanTenure)}&interestRate=${encodeURIComponent(interestRate)}&apikey=${apiKey}`;

    const response = await axios.get(url);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("EMI Calculator API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch EMI calculator data" }),
      { status: 500 }
    );
  }
}
