
import mongoose from 'mongoose'


const TestimonialSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    image: {
        url: String,
        public_id: String,
    },
    content: {
        type: String,
        default: false
    },
},
    {
        timestamps: true
    })

const TestimonialModel = mongoose.models.testimonial || mongoose.model('testimonial', TestimonialSchema);

export default TestimonialModel;