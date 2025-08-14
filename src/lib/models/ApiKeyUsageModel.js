import mongoose from 'mongoose';

const ApiKeyUsageSchema = new mongoose.Schema({
    apikey: { type: String, required: true, unique: true },
    monthlyHitCount: { type: Number, default: 0 },
    lastMonthlyReset: { type: Date, default: Date.now },
});
const ApiKeyUsageModel = mongoose.models.ApiKeyUsage || mongoose.model('ApiKeyUsage', ApiKeyUsageSchema);
export default ApiKeyUsageModel;