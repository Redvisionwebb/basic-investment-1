import mongoose from 'mongoose';

const AboutUsSchema = new mongoose.Schema(
  {
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const AboutUsModel =
  mongoose.models.aboutus || mongoose.model('aboutus', AboutUsSchema);

export default AboutUsModel;
