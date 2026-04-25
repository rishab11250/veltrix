const express = require('express');
const router = express.Router();
const { getPayments, getPaymentStats, createPayment } = require('../controllers/paymentController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getPayments)
  .post(createPayment);

router.get('/stats', getPaymentStats);

module.exports = router;
