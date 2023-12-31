import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './billing.css'

const BillingInformation = ({ userId }) => {
  const [billingInfo, setBillingInfo] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/billing-information`, { withCredentials: true })
      .then(response => setBillingInfo(response.data))
      .catch(error => console.error('Error fetching billing information:', error));
  }, [userId]);

  return (
    <div className="billing-info-container">
      <h2 className="billing-info-heading">Billing Information</h2>
      {billingInfo && (
        <div className="billing-info-details-container">
          <p className="billing-info-detail">Current Billing Cycle: {billingInfo.currentBillingCycle}</p>
          <p className="billing-info-detail">Cumulative Usage: {billingInfo.cumulativeUsage}</p>
          <p className="billing-info-detail">Billing Amount: {billingInfo.billingAmount}</p>
        </div>
      )}
    </div>
  );
};


export default BillingInformation;
