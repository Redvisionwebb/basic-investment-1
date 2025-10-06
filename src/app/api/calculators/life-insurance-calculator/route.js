import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const loanAmount = searchParams.get("loanAmount");
    const currentFdRate = searchParams.get("currentFdRate");
    const protectionDuration = searchParams.get("protectionDuration");
    const inflationRate = searchParams.get("inflationRate");
    const monthlyExpenses = searchParams.get("monthlyExpenses");

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/life-insurance-calculator`;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const url = `${apiUrl}?loanAmount=${encodeURIComponent(loanAmount)}&currentFdRate=${encodeURIComponent(currentFdRate)}&protectionDuration=${encodeURIComponent(protectionDuration)}&inflationRate=${encodeURIComponent(inflationRate)}&monthlyExpenses=${encodeURIComponent(monthlyExpenses)}&apikey=${apiKey}`;

    const response = await axios.get(url);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Life Insurance Calculator API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch life insurance calculator data" }),
      { status: 500 }
    );
  }
}
