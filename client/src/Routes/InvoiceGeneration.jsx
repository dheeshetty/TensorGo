import React from 'react';
import axios from 'axios';
import './invoice.css'

const InvoiceGeneration = ({ userId }) => {
    const handleGenerateInvoice = async () => {
        try {
          const response = await axios.post('http://localhost:3000/generate-invoice', {}, { withCredentials: true });
          console.log('Invoice generated successfully:', response.data);
        } catch (error) {
          console.error('Error generating invoice:', error.response?.data || error.message);
        }
      };
      

  return (
    <div className="invoice-generation-container">
    <h2>Invoice Generation</h2>
    <button className="generate-invoice-button" onClick={handleGenerateInvoice}>
      Generate Invoice
    </button>
  </div>
);
};

export default InvoiceGeneration;
