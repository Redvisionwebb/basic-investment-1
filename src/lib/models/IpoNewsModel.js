
import mongoose from 'mongoose'


const IpoNewsSchema = new mongoose.Schema({
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

const IpoNewsModel = mongoose.models.iponews || mongoose.model('iponews', IpoNewsSchema);

export default IpoNewsModel;