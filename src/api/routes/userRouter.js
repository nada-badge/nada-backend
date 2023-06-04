const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.use('/signUp', userController.signUp);
router.use('/login', userController.login);

// router.use('/logout', authController.logout);

module.exports = router;