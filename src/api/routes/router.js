const express = require('express');
const userRouter = require('./userRouter');
const activityRouter = require('./activityRouter');

const router = express.Router();

router.use('/user', userRouter);
router.use('/activity', activityRouter);

module.exports = router;