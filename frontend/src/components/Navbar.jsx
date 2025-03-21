import { useState, useEffect } from 'react';
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

  const toggleMenu = (e) => {
    // Prevent event bubbling when clicking on hamburger menu
    if (e) {
      e.stopPropagation();
    }
    setMenuOpen(!menuOpen);
  };
  
  // Update body class when menu state changes
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open');
      document.querySelector('.navbar').classList.add('expanded');
    } else {
      document.body.classList.remove('menu-open');
      document.querySelector('.navbar').classList.remove('expanded');
    }
  }, [menuOpen]);

  return (
    <div className='navbar'>
        <div className='logo'>
            <img src="/logo.svg" alt="logo"/>
        </div>
        <div className='hamburger' onClick={toggleMenu}>
          <img src="/hamburger-menu.svg" alt="menu"/>
        </div>
        <ul className={menuOpen ? 'open' : ''}>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
            <li><Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link></li>
            <li className='navbar-btn'><Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link></li>
            {isLoggedIn ? 
              <li className='navbar-btn'><Link to="/login" onClick={() => { setMenuOpen(false); handleLogout(); }}>Logout</Link></li> : 
              <li className='navbar-btn'><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
            }
        </ul>
    </div>
  );
};

export default Navbar;