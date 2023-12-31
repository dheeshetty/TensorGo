const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true,
  },
  billingCycle: String,
  cumulativeUsage: Number,
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
