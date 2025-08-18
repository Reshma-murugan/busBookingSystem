import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Results from './pages/Results'
import BusDetails from './pages/BusDetails'
import SeatBooking from './pages/SeatBooking'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Contact from './pages/Contact'
import BookingSuccess from './pages/BookingSuccess'
import './App.css'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  
  if (!token) {
    const currentPath = window.location.pathname + window.location.search
    return <Navigate to={`/login?redirect=${encodeURIComponent(currentPath)}`} replace />
  }
  
  return children
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/buses/:busId" element={<BusDetails />} />
          <Route path="/buses/:busId/seats" element={<SeatBooking />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App