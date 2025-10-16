const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const authRoutes = require('./route/authRoutes');
const connectDB = require('./utils/connectDB');
const path = require('path');

const attendanceRoutes = require("./route/attendanceRoutes.js");
const leaveRoutes = require("./route/leaveRoutes.js");
const employeeRoutes = require("./route/employeeRoutes.js");
const analyticsRoutes = require("./route/analyticsRoutes.js");
const policyRoutes = require("./route/policyRoutes.js");

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
// app.use(limiter);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get('/',(req,res)=>{
    res.send('Server is running');
})

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/policies', policyRoutes);

// Analytics route (if exists)
app.use('/api/analytics', analyticsRoutes);

// Legacy routes for events and complaints (non-HRMS - can be removed if not needed)
// app.use('/api/events', eventRoutes);
// app.use('/api/complaints', complaintRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});