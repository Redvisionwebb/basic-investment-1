import axios from "axios";

export async function GET() {
  try {
    const baseURL = process.env.NEXT_PUBLIC_DATA_API;
    const email = process.env.NEXT_PUBLIC_SMTP_MAIL;

    const response = await axios.get(`${baseURL}/api/subscription/${email}`);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Subscription API Error:", error?.message);
    return new Response(JSON.stringify({ error: "Failed to fetch subscription data" }), {
      status: 500,
    });
  }
}
