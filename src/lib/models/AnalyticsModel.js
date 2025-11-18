import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema(
  {
    googleAnalyticsId: {
      type: String,
      default: "",
      // Example: 'G-XXXXXXX'
    },
    microsoftClarityId: {
      type: String,
      default: "",
      // Example: 'abcd1234xyz'
    }
  },
  { timestamps: true }
);

// Avoid recompilation in dev mode
const AnalyticsModel =
  mongoose.models.analytics || mongoose.model("analytics", AnalyticsSchema);

export default AnalyticsModel;
