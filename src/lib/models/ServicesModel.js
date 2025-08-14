import mongoose from 'mongoose';

const ServicesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageSrc: {
            type: String,
        },
        children: [
            {
                name: {
                    type: String,
                    required: true,
                },
                link: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                    required: true,
                },
                imageSrc: {
                    type: String,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const ServicesModel = mongoose.models.Services || mongoose.model('Services', ServicesSchema);
export default ServicesModel;