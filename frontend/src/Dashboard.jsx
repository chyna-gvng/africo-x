import { useEffect, useState, useRef } from 'react';
import { getUserBalances } from './api/balances';
import { getUserAddress } from './api/contracts';
import { toast } from 'sonner'
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const loginToastShown = useRef(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await getUserBalances(token);
          setUserData(response);
        } catch (error) {
          toast.error(error.response?.data?.error || 'Failed to fetch balances');
        }
      } else {
        if (!loginToastShown.current) {
          toast.error('Please log in to view your dashboard.');
          loginToastShown.current = true;
        }
      }
    };

    fetchUserData();
  }, []);

  const handleCopyAddress = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const addressResponse = await getUserAddress(token);
        const userAddress = addressResponse.userAddress;

        await navigator.clipboard.writeText(userAddress);
        toast.success('Address copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy address: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handleRefreshBalances = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await getUserBalances(token);
        setUserData(response);
        toast.success('Balances refreshed');
      } catch (error) {
        toast.error('Failed to refresh balances: ' + (error.message || 'Unknown error'));
      }
    } else {
      if (!loginToastShown.current) {
        toast.error('Please log in to refresh balances.');
        loginToastShown.current = true;
      }
    }
  };

  if (!userData) {
    return <div><img src="/sad.svg" alt="sad" /></div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <table border="1">
        <tbody>
          <tr>
            <td>ETH</td>
            <td>{userData.ethBalance}</td>
            <td rowSpan="2"><img src="/copy.svg" alt="copy" onClick={handleCopyAddress}/></td>
          </tr>
          <tr>
            <td>CCT</td>
            <td>{userData.cctBalance}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleRefreshBalances}>Refresh</button>
    </div>
  );
};

export default Dashboard;
