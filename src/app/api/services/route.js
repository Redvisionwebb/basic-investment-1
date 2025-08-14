import { ConnectDB } from "@/lib/db/ConnectDB";
import ServicesModel from "@/lib/models/ServicesModel"; // Assuming you saved the model as ItemModel
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await ConnectDB();

        const { services } = await request.json();
        // console.log(services);
        await ServicesModel.deleteMany({});

        for (let service of services) {
            const parentItem = new ServicesModel({
                name: service.name,
                link: service.link,
                imageSrc: service.imageSrc,
                description: service.description,
                children: service.children,
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
        const services = await ServicesModel.find({});
        return NextResponse.json(services, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Error fetching services." }, { status: 500 });
    }
}
