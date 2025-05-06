const Transaction = require('../models/Transaction');

// Get all transactions for the logged-in user
const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ buyer: userId }).populate('artwork');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
  }
};

module.exports = {
  getMyTransactions
};
