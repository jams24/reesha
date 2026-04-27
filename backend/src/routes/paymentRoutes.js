const express = require('express');
const { createPayment, handleWebhook, getPaymentStatus } = require('../controllers/paymentController');

const router = express.Router();

router.post('/create', createPayment);
router.post('/webhook', handleWebhook);
router.get('/:paymentId/status', getPaymentStatus);

module.exports = router;
