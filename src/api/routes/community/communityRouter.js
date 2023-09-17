const express = require('express');
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');
// const replyRouter = require('./replyRouter')

const router = express.Router();

router.use('/post', postRouter);
router.use('/comment', commentRouter);
// router.use('/reply', replyRouter);

module.exports = router;