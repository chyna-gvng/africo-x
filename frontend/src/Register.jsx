import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [depletionRate, setDepletionRate] = useState(''); // ADDED depletionRate STATE
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/auth/register', { username, password, role, depletionRate });
      toast.success(response.data.message || 'Registration successful!');
      navigate('/login'); // Redirect to login
    } catch (error) {
      const errMessage = error.response?.data?.error || 'Something went wrong';
      toast.error(errMessage);
    }
  };

  return (
    <div className="reg-form">
      <h2>Registration</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label><img src="/at-symbol.svg" alt="at-symbol"/></label>
          <input type="text" value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label><img src="/password.svg" alt="password"/></label>
          <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label><img src="/role.svg" alt="role"/></label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select Role</option>
            <option value="1">Admin</option>
            <option value="2">Project Owner</option>
            <option value="3">Buyer</option>
          </select>
        </div>
        {role === '3' && (
          <div>
            <label><img src="/depletion.svg" alt="depletion"/></label>
            <input type="text" value={depletionRate} placeholder="Daily Depletion Rate" onChange={(e) => setDepletionRate(e.target.value)} />
          </div>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
