const express = require('express');
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');
const replyRouter = require('./replyRouter');
const topPostRouter = require('./topPostRouter');

const router = express.Router();

router.use('/post', postRouter);
router.use('/comment', commentRouter);
router.use('/reply', replyRouter);
router.use('/topPost', topPostRouter);

module.exports = router;