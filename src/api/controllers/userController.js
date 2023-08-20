const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')
const { User, Profile, Group } = require('../../models/user')
const { validationResult } = require('express-validator');

async function signUp(req, res, next) {
     try {
        const reqUser = req.body;

        const err = validationResult(req.body);
        if(!err.isEmpty()){
            return res.send('error');
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(reqUser.password, salt);
   
        const profile = new Profile({
            phoneNumber: reqUser.phoneNumber
        });

        const user = new User({ 
            email: reqUser.email,
            password: hashedPassword,
            userType: reqUser.userType,
            profile: profile
        });

        if(reqUser.userType == 2) {
            const group = new Group({
                groupName: reqUser.groupName,
                category: reqUser.category,
                represent: reqUser.represent
            });
            user.groups = group;
        }
        else if(reqUser.userType == 1) {
            user.profile.userName = reqUser.userName;
        }

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

async function checkUserName(req, res, next) {
    try {
        const userName = req.query.userName; // URL에서 추출한 변수 값

        const user = await User.findOne({ 'profile.userName': userName } );
        
        if (user) {
            return res.status(200).json({ result: 0, message: '이미 사용 중인 이름입니다.' });
        }

        res.status(200).json({ result: 1 });

    } catch (err) {
        next(err);
    }
}

async function checkEmailOverlap(req, res, next) {
    try {
        const email = req.query.email; // URL에서 추출한 변수 값

        const emailOverlap = await User.findOne({ 'email': email } );
        
        if (emailOverlap) {
            return res.status(200).json({ result: 0, message: '이미 사용 중인 이메일입니다.' });
        }

        res.status(200).json({ result: 1 });

    } catch (err) {
        next(err);
    }
}

async function checkGroupUser(req, res, next) {
    try {
        const { groupName, phoneNumber } = req.body;

        const groupUser = await User.findOne({ 'groups.groupName': groupName, 'profile.phoneNumber': phoneNumber } );
        
        if (groupUser) {
            return res.status(200).json({ result: 0, message: '이미 가입한 단체 회원입니다.' });
        }

        res.status(200).json({ result: 1 });

    } catch (err) {
        next(err);
    }
}

module.exports = {
    signUp,
    login,
    checkUserName,
    checkEmailOverlap,
    checkGroupUser
}