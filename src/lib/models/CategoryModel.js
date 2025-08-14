
import mongoose from 'mongoose'


const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    })

const CategoryModel = mongoose.models.category || mongoose.model('category', CategorySchema);

export default CategoryModel;