import mongoose from 'mongoose';

const MissionVisionSchema = new mongoose.Schema(
  {
    mission: {
      type: String,
      required: true,
    },
    vision: {
      type: String,
      required: true,
    },
    values:
      {
        type: String,
        required: true,
      },
  },
  {
    timestamps: true,
  }
);

const MissionVisionModel =
  mongoose.models.missionvision || mongoose.model('missionvision', MissionVisionSchema);

export default MissionVisionModel;
