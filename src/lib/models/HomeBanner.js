
import mongoose from 'mongoose'


const HomeBannerSchema = new mongoose.Schema({
     title: {
        type: String,
        required: true
    },
     designation: {
        type: String,
        required: true
    },
    image: {
        url: String,
        public_id: String,
    },
    auther_url: {
        type: String,
        // default: false
    },
},
    {
        timestamps: true
    })

const HomeBannerModel = mongoose.models.homebanner || mongoose.model('homebanner', HomeBannerSchema);

export default HomeBannerModel;