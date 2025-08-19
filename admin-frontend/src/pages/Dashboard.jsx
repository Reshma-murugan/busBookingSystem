import { useState, useEffect } from 'react'
import { Bus, Users, Calendar, TrendingUp } from 'lucide-react'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBuses: 35,
    activeBuses: 28,
    maintenanceBuses: 5,
    reservedBuses: 2,
    todayBookings: 156,
    todayRevenue: 78500,
    occupancyRate: 72
  })

  const [recentBookings, setRecentBookings] = useState([
    { id: 1, pnr: 'BUS240101001', route: 'Chennai → Madurai', seats: 2, amount: 1600 },
    { id: 2, pnr: 'BUS240101002', route: 'Coimbatore → Salem', seats: 1, amount: 450 },
    { id: 3, pnr: 'BUS240101003', route: 'Trichy → Chennai', seats: 3, amount: 2100 },
  ])

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'maintenance', message: 'Bus TN-01-AB-1234 due for maintenance tomorrow' },
    { id: 2, type: 'booking', message: 'High demand for Chennai → Kanyakumari route this weekend' },
    { id: 3, type: 'schedule', message: '3 buses available for emergency deployment' },
  ])

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to Meghna Travels Admin Panel</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Bus className="icon-primary" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeBuses}/{stats.totalBuses}</div>
            <div className="stat-label">Active Buses</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Users className="icon-success" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.todayBookings}</div>
            <div className="stat-label">Today's Bookings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp className="icon-warning" />
          </div>
          <div className="stat-content">
            <div className="stat-value">₹{stats.todayRevenue.toLocaleString()}</div>
            <div className="stat-label">Today's Revenue</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Calendar className="icon-info" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.occupancyRate}%</div>
            <div className="stat-label">Occupancy Rate</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="card">
            <h3 className="section-title">Recent Bookings</h3>
            <div className="bookings-list">
              {recentBookings.map(booking => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-info">
                    <div className="booking-pnr">{booking.pnr}</div>
                    <div className="booking-route">{booking.route}</div>
                  </div>
                  <div className="booking-details">
                    <div className="booking-seats">{booking.seats} seats</div>
                    <div className="booking-amount">₹{booking.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="card">
            <h3 className="section-title">System Alerts</h3>
            <div className="alerts-list">
              {alerts.map(alert => (
                <div key={alert.id} className={`alert-item alert-${alert.type}`}>
                  <div className="alert-message">{alert.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="card">
          <h3 className="section-title">Fleet Status</h3>
          <div className="fleet-grid">
            <div className="fleet-status">
              <div className="fleet-count">{stats.activeBuses}</div>
              <div className="fleet-label">Active</div>
              <div className="fleet-bar">
                <div 
                  className="fleet-fill active" 
                  style={{ width: `${(stats.activeBuses / stats.totalBuses) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="fleet-status">
              <div className="fleet-count">{stats.maintenanceBuses}</div>
              <div className="fleet-label">Maintenance</div>
              <div className="fleet-bar">
                <div 
                  className="fleet-fill maintenance" 
                  style={{ width: `${(stats.maintenanceBuses / stats.totalBuses) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="fleet-status">
              <div className="fleet-count">{stats.reservedBuses}</div>
              <div className="fleet-label">Reserved</div>
              <div className="fleet-bar">
                <div 
                  className="fleet-fill reserved" 
                  style={{ width: `${(stats.reservedBuses / stats.totalBuses) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}