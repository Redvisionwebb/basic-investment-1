
import mongoose from 'mongoose'


const LeadsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: true
    },
    message: {
        type: String,
        default: false
    },
    address: {
        type: String,
        default: false
    }
},
    {
        timestamps: true
    })

const LeadsModel = mongoose.models.leads || mongoose.model('leads', LeadsSchema);

export default LeadsModel;
