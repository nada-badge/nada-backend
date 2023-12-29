const express = require('express');
const { uploadHandler } = require('../../common/utils/image');
const imageController = require('../controllers/imageController');

const router = express.Router();

router.post('', uploadHandler.array('file', 5), imageController.uploadImage);
router.delete('', imageController.deleteImage);

module.exports = router;