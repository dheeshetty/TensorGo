const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billingSchema = new Schema({
  userId: { type: String, required: true },
  currentBillingCycle: { type: String, required: true },
  cumulativeUsage: { type: Number, default: 0 },
  billingAmount: { type: Number, default: 0 },
});

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
