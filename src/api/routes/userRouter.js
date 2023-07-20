const express = require('express');
const userController = require('../controllers/userController');
const validator = require('../middleware/validate');
const checker = require('../middleware/user');

const router = express.Router();

router.use('/signUp', [checker.validateSignUp, validator.validateRequest], userController.signUp);
router.use('/login', [checker.validateLogin, validator.validateRequest], userController.login);
router.get('/checkUserName', userController.checkUserName);
router.get('/checkEmailOverlap', userController.checkEmailOverlap);

// router.use('/logout', userController.logout);

module.exports = router;