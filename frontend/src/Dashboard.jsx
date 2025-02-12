import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getUserBalances } from './api/balances';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await getUserBalances(token);
          setUserData(response);
        } catch (error) {
          setMessage(error.response.data.error);
        }
      } else {
        setMessage('Please log in to view your dashboard.');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!userData) {
    return <div>{message}</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Ethereum Balance: {userData.ethBalance} ETH</p>
      <p>Carbon Credit Balance: {userData.cctBalance} CCT</p>
      {localStorage.getItem('token') && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
};

export default Dashboard;
