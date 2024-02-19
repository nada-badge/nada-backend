const express = require('express');
const contactController = require('../controllers/contactController');

const router = express.Router();

router.post('', contactController.sendContact);
router.get('/list', contactController.listContact);

module.exports = router;