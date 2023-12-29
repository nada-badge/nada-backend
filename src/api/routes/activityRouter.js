const express = require('express');
const activityController = require('../controllers/activityController');

const router = express.Router();

router.post('', activityController.addActivity);
router.get('', activityController.getActivity);
router.get('/list', activityController.listActivity);
router.get('/search', activityController.searchActivity);
router.patch('', activityController.updateActivity);
router.delete('', activityController.deleteActivity);

module.exports = router;