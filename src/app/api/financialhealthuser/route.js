import { ConnectDB } from "@/lib/db/ConnectDB"
import FinancialHealthUsersModel from "@/lib/models/FinancialHealthUsersModel";
import { NextResponse } from "next/server";

const LoadDB = async () => {
    await ConnectDB();
}

LoadDB()


export async function GET(request) {
    const users = await FinancialHealthUsersModel.find({});
    return NextResponse.json(users, { status: 200 })
}