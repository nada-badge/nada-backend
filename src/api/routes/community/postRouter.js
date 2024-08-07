const express = require('express');
const postController = require('../../controllers/community/postController');

const router = express.Router();

router.post('', postController.addPost);
router.get('', postController.getPost);
router.get('/list', postController.listPost);
router.patch('', postController.updatePost);
router.delete('', postController.deletePost);
router.get('/search', postController.searchPost);
router.post('/report', postController.reportPost);
router.get('/myPost', postController.myPost);
router.get('/myComment', postController.getPostContainedMyComment);
router.get('/reportedList', postController.reportedPost);

module.exports = router;