import { ConnectDB } from "@/lib/db/ConnectDB";
import FaqsModel from "@/lib/models/FaqsModel"; // Assuming you saved the model as ItemModel
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await ConnectDB();

        const { services } = await request.json();
        await FaqsModel.deleteMany({});

        for (let service of services) {
            const parentItem = new FaqsModel({
                question: service.question,
                answer: service.answer,
            });
            await parentItem.save();
        }

        return NextResponse.json({ msg: "Created" }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Error sending message." }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        await ConnectDB();
        const faq = await FaqsModel.find({});
        return NextResponse.json(faq, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Error fetching faq." }, { status: 500 });
    }
}
