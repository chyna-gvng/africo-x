import { useEffect, useState } from 'react';
import { getUserBalances } from './api/balances';
import { getUserAddress } from './api/contracts';
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');

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

  const handleCopyAddress = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const addressResponse = await getUserAddress(token); // Get the entire response object
        const userAddress = addressResponse.userAddress; // Extract the userAddress

        navigator.clipboard.writeText(userAddress)
          .then(() => {
            setMessage('Address copied to clipboard!');
            setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
          })
          .catch(error => {
            setMessage('Failed to copy address: ' + error.message);
          });
      } finally {
        setMessage('Please log in to copy your address.');
      }
    }
  };

  const handleRefreshBalances = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await getUserBalances(token);
      setUserData(response);
    }
  };

  if (!userData) {
    return <div>{message}</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <table border="1">
        <tr>
          <td>ETH</td>
          <td>{userData.ethBalance}</td>
          <td rowSpan="2"><img src="/copy.svg" alt="copy" onClick={handleCopyAddress}/></td>
        </tr>
        <tr>
          <td>CCT</td>
          <td>{userData.cctBalance}</td>
        </tr>
      </table>
      <button onClick={handleRefreshBalances}>Refresh</button>
    </div>
  );
};

export default Dashboard;
