import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema(
  {
    image: {
      url: { type: String},
      public_id: { type: String},
    },
    name: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    socialMedia: [
      {
        name: { type: String }, // e.g., "LinkedIn", "Twitter"
        link: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TeamModel =
  mongoose.models.team || mongoose.model('team', TeamMemberSchema);

export default TeamModel;