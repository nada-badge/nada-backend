const express = require('express');
const userRouter = require('./userRouter');
const activityRouter = require('./activityRouter');
const communityRouter = require('./community/communityRouter')
const calendarRouter = require('./calendarRouter');
const imageRouter = require('./imageRouter');
const homeRouter = require('./homeRouter');
const mypageRouter = require('./mypageRouter');

const router = express.Router();

router.use('/user', userRouter);
router.use('/activity', activityRouter);
router.use('/community', communityRouter);
router.use('/calendar', calendarRouter);
router.use('/image', imageRouter);
router.use('/home', homeRouter);
router.use('/mypage', mypageRouter);

module.exports = router;