import React, { useEffect, useState } from 'react';
import { getUserBalances } from '../api/balances';
import { getUserRole } from '../api/user';
import { submitProject } from '../api/contracts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const balancesResponse = await getUserBalances(token);
          setUserData(balancesResponse);

          const roleResponse = await getUserRole(token);
          setUserRole(roleResponse.role);
        } catch (error) {
          setMessage(error.error);
        }
      } else {
        setMessage('Please log in to view your dashboard.');
      }
    };

    fetchUserData();
  }, []);

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await submitProject(token, projectName);
        setMessage(response.message);
        setProjectName(''); // Clear the form
      } catch (error) {
        setMessage(error.error);
      }
    } else {
      setMessage('Please log in to submit a project.');
    }
  };

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
      {userRole === 2 && (
        <div>
          <h3>Submit New Project</h3>
          <form onSubmit={handleSubmitProject}>
            <div>
              <label>Project Name:</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>
            <button type="submit">Submit Project</button>
          </form>
        </div>
      )}
      {message && <p>{message}</p>}
      {localStorage.getItem('token') && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
};

export default Dashboard;
