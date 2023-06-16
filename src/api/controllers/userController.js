const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')
const { User, Profile } = require('../../models/user')
const { check, validationResult } = require('express-validator');

async function signUp(req, res, next) {
     try {
        const { email, password, userType, userName, phoneNumber } = req.body;

        const err = validationResult(req.body);
        if(!err.isEmpty()){
            return res.send('error');
        }
        
        //    회원가입 시 암호화된 비밀번호로 유저 객체가 정상적으로 생성이 안 되는 문제 발생 -------- issue 1
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const profile = new Profile({
            userName: userName,
            phoneNumber: phoneNumber
        });

        const user = new User({ 
            email: email,
            password: hashedPassword,
            userType: userType,
            profile: profile
        });

        await user.save();

        res.status(200).json({ message: '회원가입 성공' });

    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        // 1. 사용자 확인
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: '사용자 확인이 불가능합니다.' });
        }

        // 2. 비밀번호 확인

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: '비밀번호가 올바르지 않습니다.' });
        }

        // 3. 토큰 발급
        const token = jwt.sign(
            { email: user.email },
            config.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
        
    } catch (err) {
        next(err);
    }
}

module.exports = {
    signUp,
    login
}