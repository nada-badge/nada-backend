const express = require('express');
const mypageController = require('../controllers/mypageController');

const router = express.Router();

router.post('', mypageController.addField);
router.post('/notice', mypageController.addNotice);
router.get('/notice', mypageController.getNotice);
router.get('/notice/list', mypageController.listNotice);
router.patch('/notice', mypageController.updateNotice);
router.delete('/notice', mypageController.deleteNotice)

module.exports = router;