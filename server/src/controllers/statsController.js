const Client = require('../models/Client');
const Invoice = require('../models/Invoice');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalClients = await Client.countDocuments({ userId });
    const totalInvoices = await Invoice.countDocuments({ userId });
    
    // Revenue placeholders (will update once Phase 6 Invoices is complete)
    const totalRevenue = 0;
    const pendingAmount = 0;

    const recentClients = await Client.find({ userId })
      .sort('-createdAt')
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        totalClients,
        totalInvoices,
        totalRevenue,
        pendingAmount,
        recentActivity: recentClients, // using recent clients for activity stream currently
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
