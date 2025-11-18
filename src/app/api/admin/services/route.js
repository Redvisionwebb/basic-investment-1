// /api/admin/services/route.js
import { NextResponse } from "next/server";
import axios from "axios";
import { ConnectDB } from "@/lib/db/ConnectDB";
import AdminServiceModel from "@/lib/models/AdminServiceModel";
import { slugify } from "@/lib/functions";

export async function POST(req) {
  await ConnectDB();
  try {
    const { version, services } = await req.json(); // services = ["id1", "id2"]

    if (!version) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Get existing services with updateServices: true to exclude them from operations
    const existingServicesWithUpdateFlag = await AdminServiceModel.find({
      versionSlug: version,
      updateServices: true
    }).select('superServiceId');

    const excludedServiceIds = existingServicesWithUpdateFlag.map(s => s.superServiceId);

    // fetch full version from superadmin
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_DATA_API}/api/services/${version}`
    );
    const superVersion = res.data.version;

    if (!superVersion) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    // 🔥 filter only selected services, but exclude those with updateServices: true
    const selectedServices = superVersion.services.filter((s) =>
      services.includes(s._id.toString()) && !excludedServiceIds.includes(s._id.toString())
    );

    // save in local admin DB (only for services without updateServices: true)
    for (const srv of selectedServices) {

      await AdminServiceModel.findOneAndUpdate(
        { superServiceId: srv._id },
        {
          superServiceId: srv._id,
          versionSlug: version,
          name: srv.name,
          link: slugify(srv.name),
          description: srv.description,
          metaTitle: srv.metaTitle,
          metaDescription: srv.metaDescription,
          metaKeywords: Array.isArray(srv.metaKeywords)
            ? srv.metaKeywords
            : srv.metaKeyword
              ? srv.metaKeyword.split(",").map((k) => k.trim())
              : [],
          icon: srv.icon,
          image: srv.image,
          features: srv.features,
          benefits: srv.benefits,
          status: true,
        },
        { upsert: true, new: true }
      );
    }

    // Delete services that are not in the selected list and don't have updateServices: true
    await AdminServiceModel.deleteMany({
      versionSlug: version,
      superServiceId: { $nin: services },
      updateServices: { $ne: true },
    });

    return NextResponse.json(
      { message: "Services synced", count: selectedServices.length },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error saving admin services:", err);
    return NextResponse.json(
      { error: "Error saving admin services", details: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await ConnectDB();

  try {
    const { searchParams } = new URL(req.url);
    const version = searchParams.get("version"); // optional filter

    const query = {};
    if (version) query.versionSlug = version;

    const data = await AdminServiceModel.find(query);

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  await ConnectDB();

  try {
    const formData = await req.formData();
    const serviceId = formData.get("serviceId");

    const updatePayload = {
      name: formData.get("name"),
      description: formData.get("description"),
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      metaKeywords: formData.get("metaKeywords"),
    };

    // Handle service icon
    const icon = formData.get("icon");
    if (icon instanceof File) {
      const uploaded = await saveImageToLocal("blogs", icon);
      updatePayload.icon = `/uploads/blogs/${uploaded.filename}`;
      // optionally: deleteFileIfExists("blogs", oldIcon)
    } else if (typeof icon === "string") {
      updatePayload.icon = icon;
    }

    // Handle features
    const features = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("features")) {
        const match = key.match(/features\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const idx = parseInt(match[1], 10);
          const field = match[2];
          if (!features[idx]) features[idx] = {};
          if (value instanceof File) {
            const uploaded = await saveImageToLocal("blogs", value);
            features[idx][field] = `/uploads/blogs/${uploaded.filename}`;
          } else {
            features[idx][field] = value;
          }
        }
      }
    }
    updatePayload.features = features;

    // Handle benefits
    const benefits = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("benefits")) {
        const match = key.match(/benefits\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const idx = parseInt(match[1], 10);
          const field = match[2];
          if (!benefits[idx]) benefits[idx] = {};
          if (value instanceof File) {
            const uploaded = await saveImageToLocal("blogs", value);
            benefits[idx][field] = `/uploads/blogs/${uploaded.filename}`;
          } else {
            benefits[idx][field] = value;
          }
        }
      }
    }
    updatePayload.benefits = benefits;

    // Update DB
    await AdminServiceModel.findByIdAndUpdate(serviceId, updatePayload, { new: true });

    return NextResponse.json({ success: true, message: "Service updated" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}