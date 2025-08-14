import { ConnectDB } from "@/lib/db/ConnectDB"
import RiskUsersModel from "@/lib/models/RiskUsersModel";

import { NextResponse } from "next/server";

const LoadDB = async () => {
    await ConnectDB();
}

LoadDB()


export async function GET(request) {
    const users = await RiskUsersModel.find({});
    return NextResponse.json(users, { status: 200 })
}