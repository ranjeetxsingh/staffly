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
    participatedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    points: { 
        type: Number,
        default: 0 
    },
    legitComplaints: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Complaint" 
        }
    ],
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
        enum: ['user', 'admin','ngo'],
        default: 'user'
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
