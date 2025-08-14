
import mongoose from 'mongoose'


const WebpopupsSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false
    },
    image: {
        url: String,
        public_id: String,
    },
},
    {
        timestamps: true
    })

const WebpopupsModel = mongoose.models.web_popups || mongoose.model('web_popups', WebpopupsSchema);

export default WebpopupsModel;