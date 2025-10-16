const User = require('../models/User');
const Profile = require('../models/Profile');
const bcrypt = require('bcryptjs');
const { generateAndSetCookies, clearCookies } = require('../utils/generateAndSetCookies');
const { oauth2client } = require('../utils/googleConfig');
const axios = require('axios');

// Register new user
const register = async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;
        console.log(email, password, name, phone);
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const profilePicture = "https://www.pngitem.com/pimgs/m/146-1468479_transparent-avatar-png-default-avatar-png-transparent-png.png";
        // Create new user
        // const profile = await Profile.create({bio, phone, occupation, address, city, state, pinCode, linkedIn, location});cosnt
        const profile = new Profile({
            bio: "This is a default bio",
            phone:phone,}); 
            
        await profile.save();
        const user = new User({
            email,
            password: hashedPassword,
            name,
            profilePicture,
            profile: profile._id,
            profile: profile,

        });

        await user.save();

        // Generate and set cookie
        const token = generateAndSetCookies(user._id, res);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            },
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
        console.log("Error in register authController",error);        
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if user has a password (was created through regular registration)
        if (!user.password) {
            return res.status(400).json({ 
                message: 'This email is registered with Google. Please use Google login instead.' 
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        const profile = await Profile.findById(user.profile);
        
        // Check if this user is an employee and get employee data
        const Employee = require('../models/Employee');
        const employeeData = await Employee.findOne({ user: user._id })
            .populate('reportsTo', 'name email employeeId designation');
        
        // Generate and set cookie
        const token = generateAndSetCookies(user._id, res);
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture,
                role: user.role,
                profile: profile,
                participatedEvents: user.participatedEvents,
                employee: employeeData ? {
                    id: employeeData._id,
                    employeeId: employeeData.employeeId,
                    department: employeeData.department,
                    designation: employeeData.designation,
                    status: employeeData.status,
                    reportsTo: employeeData.reportsTo
                } : null
            },
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
        console.log("Error in login authController",error);
    }
};

const oauthLogin = async (req,res)=>{
    try {
        const {code} = req.query;
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        const {email, name, picture} = userRes.data;
        console.log(email, name, picture);
        
        // Find existing user
        let user = await User.findOne({ email });
        
        if(!user){
            
            const profile = new Profile({
                bio: "This is a default bio",
            });
            await profile.save();
            // Create new user
            user = await User.create({
                email,
                name,
                profilePicture: picture,
                googleId: userRes.data.id,
                profile: profile._id,
                role:'user'
            });
        }
        
        const {_id} = user;
        const token = generateAndSetCookies(_id,res);
        const userProfile=await Profile.findById(user.profile);
        res.json({
            message: 'OAuth login successful',
            user: {
                id: _id,
                email,
                name,
                profilePicture: picture,
                role:user.role,
                profile:userProfile,
                participatedEvents:user.participatedEvents
            },
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error with OAuth login', error: error.message });
        console.log("Error in oauthLogin authController",error);
    }
}

// Logout user
const logout = async (req, res) => {
    try {
        clearCookies(res);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out', error: error.message });
        console.log("Error in logout authController",error);
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
        console.log("Error in getCurrentUser authController",error);
    }
};
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing password', error: error.message });
        console.log("Error in Change password authController",error);
    }
};
const updateProfile = async (req, res) => {
    try {
      const {
        bio,
        phone,
        occupation,
        address,
        city,
        state,
        pinCode,
        linkedIn,
        twitter,
        instagram,
        facebook,
        latitude,
        longitude,
      } = req.body;
  
      const profile = await Profile.findById(req.user.profile);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
  
      // Update fields
      if (bio) profile.bio = bio;
      if (phone) profile.phone = phone;
      if (occupation) profile.occupation = occupation;
      if (address) profile.address = address;
      if (city) profile.city = city;
      if (state) profile.state = state;
      if (pinCode) profile.pinCode = pinCode;
      if (linkedIn) profile.linkedIn = linkedIn;
      if (twitter) profile.twitter = twitter;
      if (instagram) profile.instagram = instagram;
      if (facebook) profile.facebook = facebook;
  
      // Update location
      if (latitude && longitude) {
        profile.latitude = parseFloat(latitude);
        profile.longitude = parseFloat(longitude);
        profile.location = {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        };
      }
  
      await profile.save();
  
      res.json({ message: "Profile updated successfully", profile });
    } catch (error) {
      console.error("Error in updateProfile authController:", error);
      res.status(500).json({
        message: "Error updating profile",
        error: error.message,
      });
    }
  };
  

const deleteAccount = async (req, res) => {
    try {
        const profile = await Profile.findByIdAndDelete(req.user.profile);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error: error.message });
        console.log("Error in deleteAccount authController",error);
    }
}
const getUserForLeaderboard = async (req, res) => {
    
    try {
        // Fetch top 20 users sorted by points in descending order
        const topUsers = await User.find()
            .sort({ points: -1 })  // Sort by points in descending order
            .limit(20)  // Limit the result to top 20 users
            .select('name points profilePicture _id')  // Select only relevant fields
            .exec();

            
        
        // Check if there are no users
        if (!topUsers || topUsers.length === 0) {
            return res.status(404).json({
                message: "No users found for the leaderboard."
            });
        }

        // Respond with the leaderboard data
        return res.status(200).json({
            message: "Top 20 users fetched successfully.",
            leaderboard: topUsers
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return res.status(500).json({
            message: "An error occurred while fetching the leaderboard.",
            error: error.message
        });
    }
};
module.exports = {
    register,
    login,
    oauthLogin,
    logout,
    getCurrentUser,
    changePassword,
    deleteAccount,
    updateProfile,
    getUserForLeaderboard,

};

