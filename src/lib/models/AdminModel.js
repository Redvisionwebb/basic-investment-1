import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["normaladmin", "devadmin"], default: "normaladmin" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

const AdminModel = mongoose.models.admin || mongoose.model("admin", AdminSchema);

export default AdminModel;
