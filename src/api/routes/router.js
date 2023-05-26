const express = require('express');
const login = require('../controllers/auth.js');

const router = express.Router();

//router.post('/register', authController.signup);
router.post('/login', login);
// router.use('/logout', authController.logout);

module.exports = router;