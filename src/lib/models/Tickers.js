import mongoose from 'mongoose'
const TickersSchema = new mongoose.Schema({
    indexName: {
        type: String,
        required: true
    },
    figure: {
        type: String,
        required: true
    },
    diff_amount: {
        type: String,
        default: true
    },
    percentage: {
        type: String,
        default: true
    },
},
    {
        timestamps: true
    })
const TickersModel = mongoose.models.tickers || mongoose.model('tickers', TickersSchema);
export default TickersModel;