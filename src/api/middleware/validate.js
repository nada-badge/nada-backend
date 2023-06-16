const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const err = validationResult(req);
    if(!err.isEmpty()) {
        return res.status(400).json({ err: err.array() });
    }
    next();
};

module.exports = {
    validateRequest
};