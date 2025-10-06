import mongoose from 'mongoose';

const AwardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  presentedBy: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    public_id: String,
  },
  date: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

const AwardModel = mongoose.models.award || mongoose.model('award', AwardSchema);

export default AwardModel;
