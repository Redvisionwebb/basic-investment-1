
import mongoose from 'mongoose'


const MarketNewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: true
    },
    pubDate: {
        type: String,
        default: true
    },
    image: {
        type: String,
        required: false
    },
},
    {
        timestamps: true
    })

const MarketNewsModel = mongoose.models.marketnews || mongoose.model('marketnews', MarketNewsSchema);

export default MarketNewsModel;