import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <header className="navbar">
      <div className="nav-brand"><Link to="/">Bus Booking</Link></div>
      <nav className="nav-links">
        <Link className={pathname==='/'?'active':''} to="/">Home</Link>
        <Link className={pathname.startsWith('/search')?'active':''} to="/search">Search</Link>
        <Link className={pathname.startsWith('/contact')?'active':''} to="/contact">Contact</Link>
        <Link className={pathname.startsWith('/profile')?'active':''} to="/profile">Profile/Login</Link>
      </nav>
    </header>
  );
}
