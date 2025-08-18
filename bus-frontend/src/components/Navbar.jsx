import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          BusBooking
        </Link>
        
        <ul className="navbar-nav">
          <li>
            <Link 
              to="/" 
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}
            >
              Contact
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link 
                  to="/profile" 
                  className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  Profile
                </Link>
              </li>
              <li className="navbar-user">
                <span>Hi, {user?.name}</span>
                <button 
                  onClick={logout}
                  className="btn btn-outline"
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link 
                to="/login" 
                className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
              >
                Login
              </Link>
            </li>
          )}
        </ul>

        <button className="mobile-menu-toggle">
          ☰
        </button>
      </div>
    </nav>
  )
}