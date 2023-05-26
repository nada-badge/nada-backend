const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')

module.exports = async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        res.send('hello world');

        /*
        // 1. 사용자 정보 확인
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
        }

        // 2. 비밀번호 확인
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(401).json({ message: 'Authentication failed' });
        }

        // 3. 토큰 발급
        const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
        );

        res.status(200).json({ token });
        */
    } catch (err) {
        next(err);
    }
}