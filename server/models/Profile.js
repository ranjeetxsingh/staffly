const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    phone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true

    },
    occupation: {
        type:
            String,
        trim: true

    },
    address: {
        type:
            String,
        trim: true

    },
    city: {
        type:
            String,
        trim: true

    },
    state: {
        type:
            String,
        trim: true

    },
    pinCode: {
        type:
            String,
        trim: true

    },
    linkedIn: {
        type:
            String,
        trim: true

    },
    facebook: {
        type:
            String,
        trim: true

    },
    instagram: {
        type:
            String,
        trim: true

    },
    twitter: {
        type:
            String,
        trim: true

    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere',
            sparse: true
        }
    },
    latitude: { type: Number },
    longitude: { type: Number },
    
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
