const express = require('express');
const postController = require('../../controllers/community/postController');

const router = express.Router();

router.post('', postController.addPost);

/*
router.get('', postController.getPost);
*/
router.get('/list', postController.listPost);

router.patch('', postController.updatePost);
router.delete('', postController.deletePost);

module.exports = router;