const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    oauthLogin, 
    logout, 
    getCurrentUser,
    changePassword,
    deleteAccount,
    updateProfile,
    getUserForLeaderboard 

} = require('../controllers/authController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/oauth', oauthLogin);
router.post('/logout', logout);
// Protected routes
router.post('/change-password', protect, changePassword);
router.post('/delete-account', protect, deleteAccount);
router.post('/update-profile', protect, updateProfile);
router.get('/me', protect   , getCurrentUser);
router.get('/userForLeaderBoard',getUserForLeaderboard)

module.exports = router;
