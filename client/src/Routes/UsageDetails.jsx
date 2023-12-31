import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './usage.css'

const UsageDetails = ({ userId }) => {
  const [usageDetails, setUsageDetails] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/usage-details`, { withCredentials: true })
      .then(response => setUsageDetails(response.data.usageDetails))
      .catch(error => console.error('Error fetching usage details:', error));
  }, [userId]);

  return (
    <div className="usage-details-container">
      <h2 className="usage-details-heading">Usage Details</h2>
      {usageDetails && (
        <div className="usage-details-details-container">
          <p className="usage-details-detail">Login Count: {usageDetails.loginCount}</p>
          <p className="usage-details-detail">Last Login At: {usageDetails.lastLoginAt}</p>

        </div>
      )}
    </div>
  );
};


export default UsageDetails;
