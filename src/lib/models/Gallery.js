
import mongoose from 'mongoose'
const GallerySchema = new mongoose.Schema({
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'gallerycategory',
      required: true,
    },
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