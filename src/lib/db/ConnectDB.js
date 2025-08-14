import mongoose from 'mongoose'

export const ConnectDB = async () => {

    const uri = process.env.MONGODB_URI;

    mongoose.connect(uri)
        .then(() => console.log('MongoDB connected'))
        .catch((err) => console.error('MongoDB connection error:', err));

}