import mongoose from 'mongoose'


const InnerBannerPageSchema = new mongoose.Schema({
     title: {
        type: String,
        required: true
    },
    image: {
        url: String,
        public_id: String,
    },
},
    {
        timestamps: true
    })

const InnerBannerPageModel = mongoose.models.innerpagebanner || mongoose.model('innerpagebanner', InnerBannerPageSchema);

export default InnerBannerPageModel;