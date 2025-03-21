import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token') !== null;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className='navbar' onClick={toggleMenu}>
        <div className='logo'>
            <img src="/logo.svg" alt="logo"/>
        </div>
        <div className='hamburger' onClick={toggleMenu}>
          <img src="/hamburger-menu.svg" alt="menu"/>
        </div>
        <ul className={menuOpen ? 'open' : ''}>
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