import mongoose from 'mongoose';

const euinSchema = new mongoose.Schema({
  euin: { type: String, required: true },
  registrationDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
});

const arnSchema = new mongoose.Schema(
  {
    arn: { type: String, required: true },
    euins: [euinSchema],
  },
  { timestamps: true }
);

const ArnModel =
  mongoose.models.ArnModel || mongoose.model('ArnModel', arnSchema);

export default ArnModel;
