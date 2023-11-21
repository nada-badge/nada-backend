const express = require('express');
const topPostController = require('../../controllers/community/topPostController');

const router = express.Router();

router.patch('', topPostController.topPosts);

module.exports = router;