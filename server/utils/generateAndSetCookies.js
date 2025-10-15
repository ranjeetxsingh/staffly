const jwt = require('jsonwebtoken');

const generateAndSetCookies = (userId, res) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    const cookieOptions = {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'none', 
        maxAge: 30*24 * 60 * 60 * 1000, 
        path: '/' 
    };

    res.cookie('jwt', token, cookieOptions);

    return token;
};

const clearCookies = (res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
    });
};

module.exports = {
    generateAndSetCookies,
    clearCookies
};
