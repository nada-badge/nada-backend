const express = require('express');
const scheduleController = require('../controllers/scheduleController');

const router = express.Router();

router.post('', scheduleController.addSchedule);
router.get('', scheduleController.getSchedule);
router.get('/list', scheduleController.listSchedule);

module.exports = router;