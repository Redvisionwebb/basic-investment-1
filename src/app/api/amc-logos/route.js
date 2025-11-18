import { ConnectDB } from "@/lib/db/ConnectDB";
import AmcsLogoModel from "@/lib/models/AmcsLogos";
import axios from "axios";
import { NextResponse } from "next/server";

// Internal function to sync data in batches
const syncAmcLogos = async (sourceData) => {
  const localData = await AmcsLogoModel.find({}).lean();
  const localIds = localData.map(item => item._id.toString());
  const sourceIds = sourceData.map(item => item._id);

  // DELETE: Remove entries not in sourceData
  const idsToDelete = localIds.filter(id => !sourceIds.includes(id));
  if (idsToDelete.length > 0) {
    await AmcsLogoModel.deleteMany({ _id: { $in: idsToDelete } });
  }

  // UPSERT in batches of 10
  const batchSize = 10;
  for (let i = 0; i < sourceData.length; i += batchSize) {
    const batch = sourceData.slice(i, i + batchSize);

    const promises = batch.map(item =>
      AmcsLogoModel.findByIdAndUpdate(
        item._id,
        {
          logo: item.logo,
          logoname: item.logoname,
          logourl: item.logourl,
          logocategory: item.logocategory,
          status: item.status,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    );

    await Promise.all(promises);
  }
};

// POST API
export async function POST(req) {
  await ConnectDB();
  try {
    const { categoryID } = await req.json();

    // Fetch source data from RedVision
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DATA_API}/api/amc-logo`);
    const sourceData = response.data;

    // Sync in batches
    await syncAmcLogos(sourceData);

    // Filter updated data by categoryID
    const filteredData = await AmcsLogoModel.find({ logocategory: categoryID });

    return NextResponse.json({ message: "Data uploaded successfully", data: filteredData }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || error }, { status: 500 });
  }
}

// GET API
export async function GET(req) {
  await ConnectDB();
  try {
    const { searchParams } = new URL(req.url);
    const categoryID = searchParams.get("categoryID");
    const addisstatus = searchParams.get("addisstatus") === "true";

    console.log(addisstatus, "status in api");
    // 👇 Fetch source data and sync first
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DATA_API}/api/amc-logo`);
    const sourceData = response.data;
    await syncAmcLogos(sourceData);

    // Now fetch filtered data from DB
    const query = {};
    if (categoryID) query.logocategory = categoryID;
    if (searchParams.has("addisstatus")) query.addisstatus = addisstatus;

    console.log(query,"addisstatus");

    const filteredData = await AmcsLogoModel.find(query);
    console.log(filteredData)

    return NextResponse.json({ success: true, data: filteredData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || error }, { status: 500 });
  }
}
