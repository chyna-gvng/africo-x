import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://africox.angoyewally.dev/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      toast.success(response.data.message || 'Login successful!');
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      const errMessage = error.response?.data?.error || 'Login failed';
      toast.error(errMessage);
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label><img src="/at-symbol.svg" alt="at-symbol"/></label>
          <input type="text" value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label><img src="/password.svg" alt="password"/></label>
          <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
