
import mongoose from 'mongoose'


const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    embedUrl: {
        type: String,
        // required: true
    },
    image: {
        url: String,
        public_id: String,
    },
},
    {
        timestamps: true
    })

const VideoModel = mongoose.models.video || mongoose.model('video', VideoSchema);

export default VideoModel;