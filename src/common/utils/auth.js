const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { RefreshToken } = require('../../models/jwt')
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

// refresh token 생성
async function generateRefreshToken(userId) {
    try {
        const refreshToken = jwt.sign({ userId }, config.JWT_REFRESH_SECRET, { expiresIn: '14d' });
        await RefreshToken.create({ userId, refreshToken, expiresAt });
        await refreshToken.save()
        
        return refreshToken;
    } catch {
        return res.status(403).json({ message: 'refresh token 생성에 실패하였습니다.' });
    }
}

// refresh token 검증
async function verifyRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET);
        const storedToken = await RefreshToken.findOne({ userId: decoded.userId, token: token });

        if(!storedToken || storedToken.expiredAt < new Date()) {
            return res.status(403).json({ message: 'refresh token이 존재하지 않거나 유효하지 않습니다.' });
        }
        
        return decoded;
    } catch {
        return res.status(403).json({ message: 'refresh token 검증에 실패하였습니다.' });
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
    generateRefreshToken,
    verifyRefreshToken,
    generateHashedPassword,
    comparePassword
};