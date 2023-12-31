
const mongoose = require('mongoose');

const usageDetailsSchema = new mongoose.Schema({
  loginCount: { type: Number, default: 0 },
  lastLoginAt: { type: Date, default: null },
});

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  usageDetails: { type: usageDetailsSchema, default: {} },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
