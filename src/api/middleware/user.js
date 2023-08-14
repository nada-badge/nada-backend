const { check } = require('express-validator');

const validateSignUp = [
    check('email').isEmail().withMessage('Invalid email'),
    check('email').notEmpty().withMessage('Email is required'),
    check('password').notEmpty().withMessage('Password is required'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    check('password').matches(/^(?=.*[A-Za-z])/).withMessage('Password must include one letter'),
    check('password').matches(/^(?=.*\d)/).withMessage('Password must include one number'),
    check('password').matches(/^(?=.*[!@#$%^&*])/).withMessage('Password must include one special character'),
    check('userType').notEmpty().withMessage('userType is required'),
//    check('userName').notEmpty().withMessage('userName is required'),
    check('phoneNumber').notEmpty().withMessage('phoneNumber is required'),
];

const validateLogin = [
    check('email').notEmpty().withMessage('Email is required'),
    check('password').notEmpty().withMessage('Password is required'),
];

module.exports = {
    validateSignUp,
    validateLogin
};
