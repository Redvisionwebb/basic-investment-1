import mongoose from "mongoose";

const AdminServiceSchema = new mongoose.Schema({
    superServiceId: { type: String, required: true }, // link to superadmin service
    versionSlug: { type: String, required: true },
    name: String,
    link: String,
    description: String,
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [{ type: String }],
    icon: {
        url: String,
        public_id: String,
        status: { type: Boolean, default: false }
    },
    image: {
        url: String,
        public_id: String,
        status: { type: Boolean, default: false }
    },
    features: [
        {
            title: String,
            description: String,
            icon: {
                url: String,
                public_id: String,
                status: { type: Boolean }
            }
        },
    ],
    benefits: [
        {
            title: String,
            description: String,
            icon: {
                url: String,
                public_id: String,
                status: { type: Boolean }
            }
        },
    ],
    status: {
        type: Boolean,
        default: false,
    },
    updateServices: { type: Boolean, default: false },
});

const AdminServiceModel = mongoose.models.AdminService || mongoose.model("AdminService", AdminServiceSchema);
export default AdminServiceModel;
