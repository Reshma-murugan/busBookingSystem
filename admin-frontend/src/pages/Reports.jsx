import { useState } from 'react'
import { Calendar, TrendingUp, Users, Bus } from 'lucide-react'
import './Reports.css'

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  const [reportData] = useState({
    revenue: {
      total: 2450000,
      daily: 78500,
      growth: 12.5
    },
    bookings: {
      total: 3250,
      confirmed: 2890,
      cancelled: 360,
      occupancyRate: 74
    },
    routes: [
      { name: 'Chennai → Madurai', bookings: 450, revenue: 360000, occupancy: 82 },
      { name: 'Coimbatore → Salem', bookings: 320, revenue: 144000, occupancy: 68 },
      { name: 'Kanyakumari → Chennai', bookings: 280, revenue: 336000, occupancy: 91 },
      { name: 'Trichy → Chennai', bookings: 380, revenue: 266000, occupancy: 75 }
    ],
    buses: [
      { number: 'TN-01-AB-1234', trips: 28, revenue: 89600, utilization: 93 },
      { number: 'TN-02-CD-5678', trips: 31, revenue: 69750, utilization: 87 },
      { number: 'TN-03-EF-9012', trips: 25, revenue: 80000, utilization: 89 },
      { number: 'TN-04-GH-3456', trips: 29, revenue: 65250, utilization: 78 }
    ]
  })

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Business insights and performance metrics</p>
        </div>
        
        <div className="date-range-picker">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="form-input"
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="reports-overview">
        <div className="overview-card">
          <div className="overview-icon revenue">
            <TrendingUp size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">₹{reportData.revenue.total.toLocaleString()}</div>
            <div className="overview-label">Total Revenue</div>
            <div className="overview-change positive">
              +{reportData.revenue.growth}% from last month
            </div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon bookings">
            <Users size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">{reportData.bookings.total.toLocaleString()}</div>
            <div className="overview-label">Total Bookings</div>
            <div className="overview-change positive">
              {reportData.bookings.confirmed} confirmed, {reportData.bookings.cancelled} cancelled
            </div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon occupancy">
            <Bus size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">{reportData.bookings.occupancyRate}%</div>
            <div className="overview-label">Occupancy Rate</div>
            <div className="overview-change positive">
              Above industry average
            </div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon daily">
            <Calendar size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">₹{reportData.revenue.daily.toLocaleString()}</div>
            <div className="overview-label">Daily Average</div>
            <div className="overview-change positive">
              Consistent performance
            </div>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-section">
          <div className="card">
            <h3 className="section-title">Top Performing Routes</h3>
            <div className="routes-performance">
              {reportData.routes.map((route, index) => (
                <div key={index} className="performance-item">
                  <div className="performance-info">
                    <div className="performance-name">{route.name}</div>
                    <div className="performance-stats">
                      {route.bookings} bookings • ₹{route.revenue.toLocaleString()}
                    </div>
                  </div>
                  <div className="performance-metrics">
                    <div className="occupancy-bar">
                      <div 
                        className="occupancy-fill" 
                        style={{ width: `${route.occupancy}%` }}
                      ></div>
                    </div>
                    <div className="occupancy-text">{route.occupancy}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="report-section">
          <div className="card">
            <h3 className="section-title">Bus Utilization</h3>
            <div className="bus-utilization">
              {reportData.buses.map((bus, index) => (
                <div key={index} className="utilization-item">
                  <div className="utilization-info">
                    <div className="bus-number">{bus.number}</div>
                    <div className="utilization-stats">
                      {bus.trips} trips • ₹{bus.revenue.toLocaleString()}
                    </div>
                  </div>
                  <div className="utilization-metrics">
                    <div className="utilization-bar">
                      <div 
                        className="utilization-fill" 
                        style={{ width: `${bus.utilization}%` }}
                      ></div>
                    </div>
                    <div className="utilization-text">{bus.utilization}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="report-section full-width">
        <div className="card">
          <h3 className="section-title">Revenue Breakdown</h3>
          <div className="revenue-breakdown">
            <div className="breakdown-item">
              <div className="breakdown-label">AC Buses</div>
              <div className="breakdown-bar">
                <div className="breakdown-fill ac" style={{ width: '65%' }}></div>
              </div>
              <div className="breakdown-value">₹1,592,500 (65%)</div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label">Non-AC Buses</div>
              <div className="breakdown-bar">
                <div className="breakdown-fill non-ac" style={{ width: '35%' }}></div>
              </div>
              <div className="breakdown-value">₹857,500 (35%)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="report-actions">
        <button className="btn btn-primary">
          Export PDF Report
        </button>
        <button className="btn btn-outline">
          Export Excel Data
        </button>
        <button className="btn btn-outline">
          Schedule Report
        </button>
      </div>
    </div>
  )
}