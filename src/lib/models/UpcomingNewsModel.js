
import mongoose from 'mongoose'


const UpcomingNewsSchema = new mongoose.Schema({
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

const UpcomingNewsModel = mongoose.models.upcomingnews || mongoose.model('upcomingnews', UpcomingNewsSchema);

export default UpcomingNewsModel;