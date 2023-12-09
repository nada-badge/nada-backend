const express = require('express');
const userRouter = require('./userRouter');
const activityRouter = require('./activityRouter');
const communityRouter = require('./community/communityRouter')
const calendarRouter = require('./calendarRouter');
const imageRouter = require('./imageRouter');

const router = express.Router();

router.use('/user', userRouter);
router.use('/activity', activityRouter);
router.use('/community', communityRouter);
router.use('/calendar', calendarRouter);
router.use('/image', imageRouter);

module.exports = router;