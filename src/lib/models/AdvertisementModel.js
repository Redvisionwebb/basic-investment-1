
import mongoose from 'mongoose'


const AdvertisementSchema = new mongoose.Schema({
    image: {
        url: String,
        public_id: String,
    },
    link: {
        type: String,
        default: false
    },
},
    {
        timestamps: true
    })

const AdvertisementModel = mongoose.models.advertisement || mongoose.model('advertisement', AdvertisementSchema);

export default AdvertisementModel;