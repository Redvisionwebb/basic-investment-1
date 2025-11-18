// /api/admin/services/route.js
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";
import AdminServiceModel from "@/lib/models/AdminServiceModel";
import { saveImageToLocal, slugify } from "@/lib/functions";

// -------------------- PUT --------------------
export async function PUT(req) {
  await ConnectDB();

  try {
    const formData = await req.formData();
    const serviceId = formData.get("serviceId");

    // Fetch existing service so we can merge icons if not re-sent
    const existingService = await AdminServiceModel.findById(serviceId);

    const updatePayload = {
      name: formData.get("name"),
      link: slugify(formData.get("name")),
      description: formData.get("description"),
      metaTitle: formData.get("metaTitle"),
      metaKeywords: formData.get("metaKeywords"),
      updateServices: true,
    };

    // ---- Handle main icon ----
    const icon = formData.get("icon");

    if (icon instanceof File) {
      const uploaded = await saveImageToLocal(`services`, icon);
      updatePayload.icon = {
        url: uploaded.url,
        public_id: uploaded.filename,
        status: true,
      };
    } else if (typeof icon === "string" && icon.trim() !== "") {
      try {
        // If it's a stringified JSON object
        const parsed = JSON.parse(icon);
        updatePayload.icon = parsed;
      } catch {
        // Otherwise treat as plain filename
        updatePayload.icon = {
          url: `/api/uploads?section=services&filename=${icon}`,
          public_id: icon,
          status: existingService.icon?.status || false, // keep old status if any
        };
      }
    } else if (typeof icon === "object" && icon !== null) {
      // Direct object already (e.g., { url, public_id })
      updatePayload.icon = icon;
    } else {
      updatePayload.icon = existingService.icon;
    }

    // 🔒 Never downgrade true → false
    if (existingService.icon?.status === true && updatePayload.icon) {
      updatePayload.icon.status = true;
    }

    // ---- Handle main icon ----
    const image = formData.get("image");

    if (image instanceof File) {
      const uploaded = await saveImageToLocal(`services`, image);
      updatePayload.image = {
        url: uploaded.url,
        public_id: uploaded.filename,
        status: true,
      };
    } else if (typeof image === "string" && image.trim() !== "") {
      try {
        // If it's a stringified JSON object
        const parsed = JSON.parse(image);
        updatePayload.image = parsed;
      } catch {
        // Otherwise treat as plain filename
        updatePayload.image = {
          url: `/api/uploads?section=services&filename=${image}`,
          public_id: image,
          status: existingService.image?.status || false, // preserve old status if any
        };
      }
    } else if (typeof image === "object" && image !== null) {
      // Direct object already (e.g., { url, public_id })
      updatePayload.image = image;
    } else {
      updatePayload.image = existingService.image;
    }

    // 🔒 Never downgrade status from true → false
    if (existingService.image?.status === true && updatePayload.image) {
      updatePayload.image.status = true;
    }

    // ---- Handle features ----
    const features = existingService.features || [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("features")) {
        const match = key.match(/features\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const idx = parseInt(match[1], 10);
          const field = match[2];
          if (!features[idx]) features[idx] = {};

          if (field === "icon") {
            if (value instanceof File) {
              const uploaded = await saveImageToLocal(`services`, value);
              features[idx][field] = {
                url: uploaded.url,
                public_id: uploaded.filename,
                status: true,
              };
            } else if (typeof value === "string" && value.trim() !== "") {
              try {
                const parsed = JSON.parse(value);
                features[idx][field] = parsed;
              } catch {
                features[idx][field] = {
                  url: `/api/uploads?section=services&filename=${value}`,
                  public_id: value,
                  status: features[idx][field]?.status || false, // preserve old status if exists
                };
              }
            } else {
              // Preserve old icon if nothing new
              features[idx][field] = features[idx][field] || null;
            }

            // 🔒 Never downgrade status from true → false
            if (
              existingService.features?.[idx]?.icon?.status === true &&
              features[idx][field]
            ) {
              features[idx][field].status = true;
            }
          } else {
            features[idx][field] = value;
          }
        }
      }
    }
    updatePayload.features = features;

    // ---- Handle benefits ----
    const benefits = existingService.benefits || [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("benefits")) {
        const match = key.match(/benefits\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const idx = parseInt(match[1], 10);
          const field = match[2];
          if (!benefits[idx]) benefits[idx] = {};

          if (field === "icon") {
            if (value instanceof File) {
              const uploaded = await saveImageToLocal(`services`, value);
              benefits[idx][field] = {
                url: uploaded.url,
                public_id: uploaded.filename,
                // ✅ once true, never false
                status: true
              };
            } else if (typeof value === "string" && value.trim() !== "") {
              try {
                const parsed = JSON.parse(value);
                // ✅ lock status: keep existing true if it was true
                benefits[idx][field] = {
                  ...parsed,
                  status: benefits[idx][field]?.status === true ? true : parsed.status || false
                };
              } catch {
                benefits[idx][field] = {
                  url: `/api/uploads?section=services&filename=${value}`,
                  public_id: value,
                  // ✅ lock status
                  status: benefits[idx][field]?.status === true ? true : false
                };
              }
            } else {
              // If nothing new provided → keep old one
              benefits[idx][field] = benefits[idx][field] || null;
            }
          } else {
            benefits[idx][field] = value;
          }
        }
      }
    }

    updatePayload.benefits = benefits;
    // ---- Update DB ----
    await AdminServiceModel.findByIdAndUpdate(serviceId, updatePayload, {
      new: true,
    });

    return NextResponse.json({ success: true, message: "Service updated" });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// -------------------- GET --------------------
export async function GET(req, { params }) {
  await ConnectDB();
  const { id } = params;

  try {
    const { searchParams } = new URL(req.url);
    const version = searchParams.get("version");

    const query = {};
    if (version) query.versionSlug = version;
    if (id) query._id = id;

    const data = await AdminServiceModel.find(query);

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  await ConnectDB();
  const { id } = await params
  try {
    await AdminServiceModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Service Deleted" });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}