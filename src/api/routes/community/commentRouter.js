const express = require('express');
const commentController = require('../../controllers/community/commentController');

const router = express.Router();

router.post('/:post_id', commentController.addComment);
/*
router.get('', commentController.getComment);
router.patch('', commentController.updCommentost);
router.delete('', commentController.deleteComment);
*/
module.exports = router;