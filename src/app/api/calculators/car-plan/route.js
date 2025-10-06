import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract parameters from incoming request query
    const currentCarCost = searchParams.get("currentCarCost");
    const planCarInYears = searchParams.get("planCarInYears");
    const expectedReturn = searchParams.get("expectedReturn");
    const inflationRate = searchParams.get("inflationRate");

    const apiUrl = `${process.env.NEXT_PUBLIC_DATA_API}/api/calculators/car-plan`;

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    // Build URL with query params + API key
    const url = `${apiUrl}?currentCarCost=${encodeURIComponent(currentCarCost)}&planCarInYears=${encodeURIComponent(planCarInYears)}&expectedReturn=${encodeURIComponent(expectedReturn)}&inflationRate=${encodeURIComponent(inflationRate)}&apikey=${apiKey}`;

    const response = await axios.get(url);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Car Plan API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch car plan data" }),
      { status: 500 }
    );
  }
}
