const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function() {
            
            return !this.googleId;
        }
    },
    name: {
        type: String,
        required: true,
        trim: true
    },

    // OAuth fields
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    // Profile picture URL (can come from OAuth or be uploaded)
    profilePicture: {
        type: String
    },
    // Additional user info
    role: {
        type: String,
        enum: ['employee', 'admin'],
        default: 'employee'
    },
    profile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
