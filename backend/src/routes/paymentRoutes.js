const express = require('express');
const { createPayment, handleWebhook, getPaymentStatus, listOrders, approveOrder } = require('../controllers/paymentController');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/create', createPayment);
router.post('/webhook', handleWebhook);
router.get('/orders', requireAdmin, listOrders);
router.patch('/:paymentId/approve', requireAdmin, approveOrder);
router.get('/:paymentId/status', getPaymentStatus);

module.exports = router;
