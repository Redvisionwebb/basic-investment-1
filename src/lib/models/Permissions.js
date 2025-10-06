// models/Permission.js
import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema({
    permission: { type: String, required: true, unique: true },
    enabled: { type: Boolean, default: false },
});

export default mongoose.models.Permission || mongoose.model("Permission", PermissionSchema);
