import { ConnectDB } from "@/lib/db/ConnectDB";
import axios from "axios";
import { NextResponse } from "next/server";
import { footerData } from "@/data/footer";

export async function GET(req, res) {
    try {
        await ConnectDB();
        // Fetch the data from the external API
        const response = await axios.get(`https://websitesbazaar.com/api/privacy-policy-api.php?company_name=${process.env.SITE_NAME}&email=${footerData.company.email}`);
        // Extract only the data field from the Axios response
        const data = response.data;
        // Return the fetched data in the response
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
