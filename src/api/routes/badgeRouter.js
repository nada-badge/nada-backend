const express = require('express');
const badgeController = require('../controllers/badgeController');

const router = express.Router();

router.post('', badgeController.issueBadge);
router.get('/list', badgeController.listBadge);
router.get('', badgeController.getBadge);

/*
router.patch('', badgeController.updateBadge);

+ 뱃지 권한 변경 API도 추가 예정
*/

module.exports = router;