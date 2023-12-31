// billing.js
const Billing = require('./../models/billing');

async function updateBillingData(userId, loginCount) {
  try {
    
    const billingInfo = await Billing.findOne({ userId }).exec();

    if (!billingInfo) {
      const newBillingInfo = new Billing({
        userId,
        currentBillingCycle: getCurrentBillingCycle(),
        cumulativeUsage: loginCount,
        billingAmount: calculateBillingAmount(loginCount),
      });
      await newBillingInfo.save();
    } else {
      billingInfo.cumulativeUsage += loginCount;
      billingInfo.billingAmount = calculateBillingAmount(billingInfo.cumulativeUsage);
      await billingInfo.save();
    }
  } catch (error) {
    console.error('Error updating billing data:', error);
    throw error;
  }
}

function calculateBillingAmount(cumulativeUsage) {
  const amountPerLogin = 100;
  const taxRate = 0.02;

  const totalAmountBeforeTax = cumulativeUsage * amountPerLogin;
  const taxes = totalAmountBeforeTax * taxRate;
  const totalBillingAmount = totalAmountBeforeTax + taxes;

  return totalBillingAmount;
}

function getCurrentBillingCycle() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const billingCycle = `${getMonthName(currentMonth)} ${currentYear}`;
  return billingCycle;
}

function getMonthName(monthIndex) {
  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  return monthNames[monthIndex];
}

module.exports = {
  updateBillingData,
  calculateBillingAmount,
  getCurrentBillingCycle,
  getMonthName,
};
