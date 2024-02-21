const express = require('express');
const commentController = require('../../controllers/community/commentController');

const router = express.Router();

router.post('/:post_id', commentController.addComment);
router.get('/list/:post_id', commentController.listComment);
router.patch('/:post_id', commentController.updateComment);
router.delete('/:post_id', commentController.deleteComment);
router.post('/report/:post_id', commentController.reportComment);
router.get('/mylist', commentController.myComment);
router.get('/reportedList', commentController.reportedComment);

module.exports = router;