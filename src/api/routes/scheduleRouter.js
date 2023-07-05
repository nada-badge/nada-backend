const express = require('express');
const scheduleController = require('../controllers/scheduleController');

const router = express.Router();

router.post('', scheduleController.addSchedule);
// router.get('/list', scheduleController.addSchedule);

module.exports = router;