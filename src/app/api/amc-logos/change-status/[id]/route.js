import { NextResponse } from 'next/server';
import AmcsLogoModel from '@/lib/models/AmcsLogos';
import { ConnectDB } from '@/lib/db/ConnectDB';


// PUT Blog by ID
export async function PUT(req, { params }) {
    const { id } = params;
    const { addisstatus } = await req.json();
    console.log(id,addisstatus)
    try {
        await ConnectDB();
        const amc = await AmcsLogoModel.findByIdAndUpdate(
            id,
            { addisstatus: addisstatus },
        );

        if (!amc) {
            return NextResponse.json({ error: 'amc not found' }, { status: 404 });
        }

        return NextResponse.json(amc, { status: 200 });
    } catch (error) {
        console.error('Error updating amc:', error);
        return NextResponse.json({ error: 'Failed to update amc' }, { status: 500 });
    }
}