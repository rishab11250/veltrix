const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const clientRoutes = require('./clientRoutes');
const invoiceRoutes = require('./invoiceRoutes');

const statsRoutes = require('./statsRoutes');

router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/stats', statsRoutes);

module.exports = router;
