const express = require('express');
const replyController = require('../../controllers/community/replyController');

const router = express.Router();

router.post('/:post_id/:comment_id', replyController.addReply);
router.patch('/:post_id/:comment_id', replyController.updateReply);
router.delete('/:post_id/:comment_id', replyController.deleteReply);

module.exports = router;