const express = require('express');
const activityController = require('../controllers/activityController');

const router = express.Router();

router.post('', activityController.addActivity);
router.get('', activityController.getActivity);
router.get('/list', activityController.listActivity);
router.patch('', activityController.updateActivity);
router.get('/recommend', activityController.recommendActivity);
router.delete('', activityController.deleteActivity);

module.exports = router;