const express = require('express');
const { list, upsert } = require('../controllers/settingController');
const { requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', list);
router.patch('/:key', requireAdmin, upload.single('file'), upsert);

module.exports = router;
