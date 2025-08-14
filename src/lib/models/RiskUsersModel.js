
import mongoose from 'mongoose'


const RiskUsersSchema = new mongoose.Schema({
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
        required: true
    },
    message: {
        type: String,
        required: true
    },
    score: {
        type: String,
        required: true
    },
    riskprofile: {
        type: String,
    },
    result: [{
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        },
        mark: {
            type: Number,
            required: true
        }
    }],
},
    {
        timestamps: true
    })

const RiskUsersModel = mongoose.models.Riskusers || mongoose.model('Riskusers', RiskUsersSchema);

export default RiskUsersModel;