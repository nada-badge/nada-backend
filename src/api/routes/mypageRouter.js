const express = require('express');
const mypageController = require('../controllers/mypageController');

const router = express.Router();

router.delete('', mypageController.deleteUser);
router.post('', mypageController.addField);
router.post('/notice', mypageController.addNotice);
router.get('/notice', mypageController.listNotice);

module.exports = router;