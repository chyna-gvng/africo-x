import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/contracts/getUserBalances', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data);
        } catch (error) {
          setMessage(error.response.data.error);
        }
      } else {
        setMessage('Please log in to view your dashboard.');
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <div>{message}</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Ethereum Balance: {userData.ethBalance} ETH</p>
      <p>Carbon Credit Balance: {userData.cctBalance} CCT</p>
    </div>
  );
};

export default Dashboard;
