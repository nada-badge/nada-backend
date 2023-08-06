const express = require('express');
const scheduleController = require('../controllers/scheduleController');

const router = express.Router();

router.post('', scheduleController.addSchedule);
router.get('', scheduleController.getSchedule);
router.get('/list', scheduleController.listSchedule);
router.patch('', scheduleController.updateSchedule);
router.delete('', scheduleController.deleteSchedule);

module.exports = router;