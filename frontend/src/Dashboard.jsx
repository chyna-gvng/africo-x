import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBalances } from './api/balances';
import './Dashboard.css';

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
    <div className="dashboard">
      <h2>Dashboard</h2>
      <table border="1">
        <tr>
          <td>ETH</td>
          <td>{userData.ethBalance}</td>
          <td rowSpan="2"><img src="/copy.svg" alt="copy"/></td>
        </tr>
        <tr>
          <td>CCT</td>
          <td>{userData.cctBalance}</td>
        </tr>
      </table>
      <button>Refresh</button>
      {localStorage.getItem('token') && <button onClick={handleLogout}>Logout</button>} {/* Move to navigation */}
    </div>
  );
};

export default Dashboard;
