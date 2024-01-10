const express = require('express');
 const { upload } = require('../../common/utils/image');
const imageController = require('../controllers/imageController');

const router = express.Router();

router.post('', upload.array('file', 5), imageController.uploadImage);
router.delete('', imageController.deleteImage);

module.exports = router;