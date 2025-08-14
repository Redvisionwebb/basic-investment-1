import mongoose from "mongoose";

const SiteSettingsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    websiteName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    alternateEmail: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    alternateMobile: {
      type: String,
    },
    whatsAppNo: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    iframe: {
      type: String,
    },
    mapurl: {
      type: String,
    },
    websiteDomain: {
      type: String,
    },
    callbackurl: {
      type: String,
    },
    siteurl: {
      type: String,
    },
    appsappleurl: {
      type: String,
    },
    appsplaystoreurl: {
      type: String,
    },
    image: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettingsModel =
  mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);

export default SiteSettingsModel;
