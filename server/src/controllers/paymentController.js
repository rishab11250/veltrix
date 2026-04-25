const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

// @desc    Get all payments for user
// @route   GET /api/v1/payments
// @access  Private
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('client', 'name email')
      .populate('invoice', 'invoiceNumber')
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get payment stats
// @route   GET /api/v1/payments/stats
// @access  Private
exports.getPaymentStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Payment.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const formattedStats = {
      totalCollected: 0,
      pendingProcessing: 0,
      failedTransactions: 0
    };

    stats.forEach(stat => {
      if (stat._id === 'Paid') formattedStats.totalCollected = stat.totalAmount;
      if (stat._id === 'Pending') formattedStats.pendingProcessing = stat.totalAmount;
      if (stat._id === 'Failed') formattedStats.failedTransactions = stat.totalAmount;
    });

    res.status(200).json({ success: true, data: formattedStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new payment
// @route   POST /api/v1/payments
// @access  Private
exports.createPayment = async (req, res) => {
  try {
    const { client, invoice, amount, method, status, date, notes } = req.body;

    // Generate a transaction ID
    const transactionId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const payment = await Payment.create({
      user: req.user._id,
      client,
      invoice,
      transactionId,
      amount,
      method,
      status,
      date,
      notes
    });

    // If payment is "Paid" and linked to an invoice, update invoice status
    if (status === 'Paid' && invoice) {
      await Invoice.findByIdAndUpdate(invoice, { status: 'paid' });
    }

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
