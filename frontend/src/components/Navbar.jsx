import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
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
            <li className='navbar-btn'><Link to="/login">Login</Link></li>
        </ul>
    </div>
  );
};

export default Navbar;