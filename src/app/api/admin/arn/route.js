import { ConnectDB } from "@/lib/db/ConnectDB";
import ArnModel from "@/lib/models/ArnModel";
import { NextResponse } from "next/server";

// =======================
// GET: Fetch all ARNs
// =======================
export async function GET() {
  try {
    await ConnectDB();
    const data = await ArnModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// =======================
// POST: Create new ARN
// =======================
export async function POST(req) {
  try {
    await ConnectDB();
    const { arn, registrationDate, expiryDate, euins } = await req.json();

    if (!arn || !registrationDate || !expiryDate) {
      return NextResponse.json({
        success: false,
        message: "ARN, registrationDate, and expiryDate are required.",
      }, { status: 400 });
    }

    const newArn = await ArnModel.create({
      arn,
      registrationDate,
      expiryDate,
      euins: euins || [],
    });

    return NextResponse.json({
      success: true,
      message: "ARN created successfully",
      data: newArn,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}

// =======================
// PUT: Update ARN or EUIN
// =======================
export async function PUT(req) {
  try {
    await ConnectDB();
    const { id, arn, registrationDate, expiryDate, euins, addEuin } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "ARN ID is required" }, { status: 400 });
    }

    const arnDoc = await ArnModel.findById(id);
    if (!arnDoc) {
      return NextResponse.json({ success: false, message: "ARN not found" }, { status: 404 });
    }

    // Update ARN-level fields if provided
    if (arn) arnDoc.arn = arn;
    if (registrationDate) arnDoc.registrationDate = registrationDate;
    if (expiryDate) arnDoc.expiryDate = expiryDate;

    // Add or update EUINs
    if (addEuin && addEuin.euin) {
      // Push a new EUIN entry
      arnDoc.euins.push(addEuin);
    } else if (euins && Array.isArray(euins)) {
      // Replace entire EUIN list (optional behavior)
      arnDoc.euins = euins;
    }

    await arnDoc.save();

    return NextResponse.json({
      success: true,
      message: "ARN updated successfully",
      data: arnDoc,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}

// =======================
// DELETE: Delete ARN
// =======================
export async function DELETE(req) {
  try {
    await ConnectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const deletedArn = await ArnModel.findByIdAndDelete(id);

    if (!deletedArn) {
      return NextResponse.json({ success: false, message: "ARN not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "ARN deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
