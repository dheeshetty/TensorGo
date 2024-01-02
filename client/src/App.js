import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UsageDetails from './Routes/UsageDetails';
import BillingInformation from './Routes/BillingInformation';
import InvoiceGeneration from './Routes/InvoiceGeneration';
import './App.css'
import login from './login.jpeg'

const App = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/protected`, { withCredentials: true });
        console.log('User Data:', response.data);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
    axios.get('http://localhost:3000/logout', { withCredentials: true })
      .then(response => {
        console.log('Logout successful:', response.data);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };
  
  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };


  return (
    <div className="container">
      <div className="left-container">
        <div className="header">
          <h1> TENSORGO </h1>
        </div>
        {userData ? (
          <div className="user-info">
                <div className="right-container">
                <h2>Hello {userData.displayName}!</h2>
                <h3>{userData.email}</h3>
                
            <UsageDetails userId={userData.id} />
        
        <BillingInformation userId={userData ? userData.id : null} />
        <InvoiceGeneration userId={userData ? userData.id : null} />
      </div>
            <button className="logout" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="user-info">
            <h5>Login with your Google Account</h5>
            <img
            className="login-image"
            src= {login} 
            alt="Login"
            onClick={handleLogin}
          />
          </div>
        )}
      </div>
    </div>
  );
};
export default App;
