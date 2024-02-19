const express = require('express');
const contactController = require('../controllers/contactController');

const router = express.Router();

router.post('', contactController.sendContact);
router.get('/list', contactController.listContact);
router.get('/:contact_id', contactController.getContact);

module.exports = router;