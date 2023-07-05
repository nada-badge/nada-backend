const express = require('express');
const userRouter = require('./userRouter');
const scheduleRouter = require('./scheduleRouter');

const router = express.Router();

router.use('/user', userRouter);
router.use('/schedule', scheduleRouter);

module.exports = router;