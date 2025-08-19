import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Bus, 
  Route, 
  Calendar, 
  BookOpen, 
  BarChart3 
} from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/buses', label: 'Buses', icon: Bus },
    { path: '/routes', label: 'Routes', icon: Route },
    { path: '/schedule', label: 'Schedule', icon: Calendar },
    { path: '/bookings', label: 'Bookings', icon: BookOpen },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ]

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-logo">
          Meghna Admin
        </Link>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-item-icon" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}