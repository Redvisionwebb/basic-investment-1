import { ConnectDB } from "@/lib/db/ConnectDB";
import AmcsLogoModel from "@/lib/models/AmcsLogos";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  await ConnectDB();
  try {
    const { categoryID } = await req.json();
    // console.log(categoryID,"dbajdhbad")

    // Fetch source data from RedVision
    const response = await axios.get("https://redvisionweb.com/api/amc-logo");
    const sourceData = response.data;
    // console.log(sourceData)

    // Fetch local data
    const localData = await AmcsLogoModel.find({});
    const localIds = localData.map(item => item._id.toString());
    const sourceIds = sourceData.map(item => item._id);

    // DELETE: Remove entries not in sourceData
    const idsToDelete = localIds.filter(id => !sourceIds.includes(id));
    await AmcsLogoModel.deleteMany({ _id: { $in: idsToDelete } });

    // UPSERT: Insert or update entries
    for (const item of sourceData) {
      await AmcsLogoModel.findByIdAndUpdate(
        item._id,
        {
          logo: item.logo,
          logoname: item.logoname,
          logourl: item.logourl,
          logocategory: item.logocategory,
          status: item.status,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // Filter updated data by categoryID
    const filteredData = await AmcsLogoModel.find({ logocategory: categoryID });

    return NextResponse.json({ message: "Data uploaded successfully", data: filteredData }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || error }, { status: 500 });
  }
}
