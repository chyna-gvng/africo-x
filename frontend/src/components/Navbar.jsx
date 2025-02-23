import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token') !== null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='navbar'>
        <div className='logo'>
            <img src="/logo.svg" alt="logo"/>
        </div>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li className='navbar-btn'><Link to="/register">Register</Link></li>
            {isLoggedIn ? <li className='navbar-btn'><Link to="/login" onClick={handleLogout}>Logout</Link></li> : <li className='navbar-btn'><Link to="/login">Login</Link></li>}
        </ul>
    </div>
  );
};

export default Navbar;