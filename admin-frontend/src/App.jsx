import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Buses from './pages/Buses'
import Routes as RoutesPage from './pages/Routes'
import Schedule from './pages/Schedule'
import Reports from './pages/Reports'
import Bookings from './pages/Bookings'
import './App.css'

function ProtectedRoute({ children }) {
  const { token, user } = useAuth()
  
  if (!token || user?.role !== 'ADMIN') {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  const { token, user } = useAuth()
  
  if (!token || user?.role !== 'ADMIN') {
    return <Login />
  }

  return (
    <div className="admin-app">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <main className="admin-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/buses" element={
                <ProtectedRoute>
                  <Buses />
                </ProtectedRoute>
              } />
              <Route path="/routes" element={
                <ProtectedRoute>
                  <RoutesPage />
                </ProtectedRoute>
              } />
              <Route path="/schedule" element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              } />
              <Route path="/bookings" element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App