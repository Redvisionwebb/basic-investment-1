import mongoose from 'mongoose';

const SocialMediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: false, // false = show, true = hide
    },
  },
  {
    timestamps: true,
  }
);

const SocialMediaModel = mongoose.models.SocialMedia || mongoose.model('SocialMedia', SocialMediaSchema);

export default SocialMediaModel;
