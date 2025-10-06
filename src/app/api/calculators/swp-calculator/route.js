import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const investedAmount = searchParams.get("investedAmount");
    const withdrawalAmount = searchParams.get("withdrawalAmount");
    const timePeriod = searchParams.get("timePeriod");
    const expectedReturn = searchParams.get("expectedReturn");

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/swp-calculator`;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const url = `${apiUrl}?investedAmount=${encodeURIComponent(
      investedAmount
    )}&withdrawalAmount=${encodeURIComponent(
      withdrawalAmount
    )}&timePeriod=${encodeURIComponent(
      timePeriod
    )}&expectedReturn=${encodeURIComponent(expectedReturn)}&apikey=${apiKey}`;

    const response = await axios.get(url);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("SWP Calculator API Error:", error?.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch SWP calculator data" }),
      { status: 500 }
    );
  }
}
