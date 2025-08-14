import { NextResponse } from 'next/server';
import PopupsModel from '@/lib/models/PopupsModel';
import { ConnectDB } from '@/lib/db/ConnectDB';

export async function PUT(req, { params }) {
    try {
        const { status, id } = await req.json();
        await PopupsModel.findByIdAndUpdate(
            id,
            {
                status: status
            })
        return NextResponse.json({ message: 'Data Aded successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error updating popup:', error);
        return NextResponse.json({ error: 'Failed to update popup' }, { status: 500 });
    }
}