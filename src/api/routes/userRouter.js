const express = require('express');
const userController = require('../controllers/userController');
const mypageController = require('../controllers/mypageController');
const validator = require('../middleware/validate');
const checker = require('../middleware/user');

const router = express.Router();

// 회원가입 및 로그인
router.use('/signUp', [checker.validateSignUp, validator.validateRequest], userController.signUp);
router.use('/login', [checker.validateLogin, validator.validateRequest], userController.login);
// router.use('/logout', userController.logout);
router.delete('', mypageController.deleteUser);

// 중복체크
router.get('/userName', userController.checkUserName);
router.get('/email', userController.checkEmailOverlap);
router.post('/groupUser', userController.checkGroupUser);

// 비밀번호 체크
router.post('/password/:user_id', userController.checkPassword);

// 사용자 조회
router.get('', userController.getUser);

module.exports = router;