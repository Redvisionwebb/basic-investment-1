
import mongoose from 'mongoose'
const GallerySchema = new mongoose.Schema({
    image: {
        url: String,
        public_id: String,
    },
},
    {
        timestamps: true
    })

const GalleryModel = mongoose.models.gallery || mongoose.model('gallery', GallerySchema);

export default GalleryModel;