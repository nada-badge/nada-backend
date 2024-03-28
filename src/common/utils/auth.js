const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("../../config/config"); 

// access token 생성
function generateAccessToken(user) {
    const payload = {
        sub: user._id,
        userType: user.userType,
        email: user.email,
    };
    return jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: '1h' });
}

// access token 검증
function verifyAccessToken(token) {
    try {
        return jwt.verify(token, config.JWT_ACCESS_SECRET);
    } catch (error) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
    }
}

async function generateHashedPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

async function comparePassword(password1, password2) {
    return await bcrypt.compare(password1, password2);
}

module.exports = { 
    generateAccessToken,
    verifyAccessToken,
    generateHashedPassword,
    comparePassword
};