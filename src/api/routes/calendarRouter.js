const express = require('express');
const calendarController = require('../controllers/calendarController');

const router = express.Router();

router.post('/bookmark', calendarController.addBookmark);
router.get('/bookmark/list', calendarController.listBookmark);
router.delete('/bookmark', calendarController.removeBookmark);

module.exports = router;