
import mongoose from 'mongoose'


const BlogsSchema = new mongoose.Schema({
    posttitle: {
        type: String,
        required: true
    },
    metatitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: true
    },
    keywords: {
        type: String,
        default: ['blogs']
    },
    image: {
        url: String,
        public_id: String,
    },
    content: {
        type: String,
        default: false
    },
    slug: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    }
},
    {
        timestamps: true
    })

const BlogsModel = mongoose.models.blogs || mongoose.model('blogs', BlogsSchema);

export default BlogsModel;