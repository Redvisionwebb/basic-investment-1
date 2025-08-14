import mongoose, { Schema, model } from 'mongoose';

const AllowedDomainSchema = new Schema({
    domain: { type: String, required: true, unique: true },
}, { timestamps: true });

const AllowedDomainModel = mongoose.models.Allowed_Domain || model('Allowed_Domain', AllowedDomainSchema);

export default AllowedDomainModel;
