// models/Category.js
import mongoose from 'mongoose';

const GalleryCategorySchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true
    },
  },
  { timestamps: true }
);

const GalleryCategoryModel = mongoose.models.gallerycategory || mongoose.model('gallerycategory', GalleryCategorySchema);
export default GalleryCategoryModel;
