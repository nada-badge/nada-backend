const express = require('express');
const activityController = require('../controllers/activityController');

const router = express.Router();

router.post('', activityController.addActivity);
router.get('', activityController.getActivity);
router.get('/list', activityController.listActivity);
router.patch('', activityController.updateActivity);
router.delete('', activityController.deleteActivity);
router.post('/report', activityController.reportActivity);

module.exports = router;