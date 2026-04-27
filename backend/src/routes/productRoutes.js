const express = require('express');
const { list, getBySlug, create, update, remove, setStock } = require('../controllers/productController');
const { requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', list);
router.get('/:slug', getBySlug);

router.post('/', requireAdmin, upload.array('images', 8), create);
router.put('/:id', requireAdmin, upload.array('images', 8), update);
router.patch('/:id/stock', requireAdmin, setStock);
router.delete('/:id', requireAdmin, remove);

module.exports = router;
