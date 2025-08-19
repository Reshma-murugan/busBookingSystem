import { useAuth } from '../contexts/AuthContext'
import { LogOut } from 'lucide-react'

export default function Topbar() {
  const { user, logout } = useAuth()

  return (
    <div className="topbar">
      <h1 className="topbar-title">Admin Panel</h1>
      
      <div className="topbar-user">
        <span>Welcome, {user?.name}</span>
        <button onClick={logout} className="btn btn-outline">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  )
}