import mongoose from "mongoose";

const StatsSchema = new mongoose.Schema(
  {
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    title: { type: String },
    subtitle: { type: String }, // or semiTitle, depending on your naming
    description: { type: String },
    statsNumber: { type: String }, // e.g. 500+ Clients, etc.
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const StatsModel =
  mongoose.models.stats || mongoose.model("stats", StatsSchema);

export default StatsModel;