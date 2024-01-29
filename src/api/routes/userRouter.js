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
router.post('/groupUser', userController.checkGroupUser)

module.exports = router;