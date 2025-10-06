import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const sourceFundAmount = searchParams.get("sourceFundAmount");
    const transferToFundAmount = searchParams.get("transferToFundAmount");
    const transferPeriod = searchParams.get("transferPeriod");
    const expectedReturnSource = searchParams.get("expectedReturnSource");
    const expectedReturnDestination = searchParams.get("expectedReturnDestination");

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiBase = process.env.NEXT_PUBLIC_DATA_API;

    const fullUrl = `${apiBase}/api/calculators/stp-calculator?sourceFundAmount=${encodeURIComponent(sourceFundAmount)}&transferToFundAmount=${encodeURIComponent(transferToFundAmount)}&transferPeriod=${encodeURIComponent(transferPeriod)}&expectedReturnSource=${encodeURIComponent(expectedReturnSource)}&expectedReturnDestination=${encodeURIComponent(expectedReturnDestination)}&apikey=${apiKey}`;

    const response = await axios.get(fullUrl);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("STP Calculator API Error:", error?.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch STP calculator data" }),
      { status: 500 }
    );
  }
}
