import mongoose from "mongoose";

const AmcsLogoSchema = new mongoose.Schema({
  logo: {
    type: String,
    required: true,
  },
  logoname: {
    type: String,
    required: true,
  },
  logourl: {
    type: String,
    required: true,
  },
  logocategory: {
    type: String, // Storing category ID as a string from RedVision API
    required: true,
  },
  status: {
    type: Boolean,
  },
  addisstatus: {
    type: Boolean,
    default: false, // New field with default value
  },
}, { timestamps: true });

const AmcsLogoModel = mongoose.models.Amcs_Logo || mongoose.model("Amcs_Logo", AmcsLogoSchema);
export default AmcsLogoModel;