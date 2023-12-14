const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

router.post('/banner', homeController.addBanner);
router.get('/banner/list', homeController.listBanner);
router.get('/banner', homeController.getBanner);
router.put('/banner/:banner_id/activate', homeController.activateBanner);
router.put('/banner/:banner_id/deactivate', homeController.deactivateBanner);


module.exports = router;