const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const protect = async (req, res, next) => {
    try {
        // Get token from cookie or Authorization header
        const authHeader = req.headers.authorization || req.headers.Authorization;
        console.log('Authorization header:', authHeader);
        
        let token;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }
        
        console.log('Token from protect middleware:', token);
 
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from token
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            console.log('User not found in protect middleware');
            return res.status(401).json({ message: 'User not found' });
        }

        console.log('User authenticated:', { id: user._id, email: user.email, role: user.role });

        // Try to find associated Employee record
        const employee = await Employee.findOne({ email: user.email });
        
        if (employee) {
            console.log('Employee found:', { id: employee._id, employeeId: employee.employeeId, role: employee.role });
            // Attach both user and employee info
            req.user = user;
            req.employee = employee;
            req.user.employeeId = employee._id; // For backward compatibility
            req.user.employeeRole = employee.role; // Employee role (can be hr, admin, manager)
        } else {
            console.log('No employee record found for user');
            // Attach just the user
            req.user = user;
        }
        
        next();
    } catch (error) {
        console.log("Error in protect middleware", error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

const hrOnly = (req, res, next) => {
  console.log('hrOnly middleware - User role:', req.user?.role, 'Employee role:', req.user?.employeeRole);
  
  // Check both User.role and Employee.role
  const isHR = req.user?.role === 'admin' || req.user?.employeeRole === 'hr' || req.user?.employeeRole === 'admin';
  
  if (isHR) {
    next();
  } else {
    console.log('Access denied - Required: hr/admin, Got:', req.user?.role);
    res.status(403).json({ 
      message: "Access denied. This endpoint requires HR or Admin role.",
      currentRole: req.user?.role 
    });
  }
};


module.exports = {
    protect,
    hrOnly
}; 