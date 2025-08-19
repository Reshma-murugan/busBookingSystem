import { useState, useEffect } from 'react'
import { Search, Filter, Eye, X } from 'lucide-react'
import './Bookings.css'

export default function Bookings() {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      pnr: 'BUS240101001',
      userName: 'Rajesh Kumar',
      userEmail: 'rajesh@email.com',
      busNumber: 'TN-01-AB-1234',
      route: 'Chennai → Madurai',
      tripDate: '2024-01-15',
      fromStop: 'Chennai',
      toStop: 'Madurai',
      seats: [1, 2],
      passengers: [
        { name: 'Rajesh Kumar', age: 35, gender: 'Male', seatNo: 1 },
        { name: 'Priya Kumar', age: 32, gender: 'Female', seatNo: 2 }
      ],
      totalAmount: 1600,
      status: 'CONFIRMED',
      bookingTime: '2024-01-10T14:30:00'
    },
    {
      id: 2,
      pnr: 'BUS240101002',
      userName: 'Meera Devi',
      userEmail: 'meera@email.com',
      busNumber: 'TN-02-CD-5678',
      route: 'Coimbatore → Salem',
      tripDate: '2024-01-16',
      fromStop: 'Coimbatore',
      toStop: 'Salem',
      seats: [15],
      passengers: [
        { name: 'Meera Devi', age: 28, gender: 'Female', seatNo: 15 }
      ],
      totalAmount: 450,
      status: 'CONFIRMED',
      bookingTime: '2024-01-11T09:15:00'
    },
    {
      id: 3,
      pnr: 'BUS240101003',
      userName: 'Arjun Reddy',
      userEmail: 'arjun@email.com',
      busNumber: 'TN-01-AB-1234',
      route: 'Chennai → Madurai',
      tripDate: '2024-01-17',
      fromStop: 'Chennai',
      toStop: 'Trichy',
      seats: [10, 11, 12],
      passengers: [
        { name: 'Arjun Reddy', age: 29, gender: 'Male', seatNo: 10 },
        { name: 'Kavya Reddy', age: 26, gender: 'Female', seatNo: 11 },
        { name: 'Aarav Reddy', age: 5, gender: 'Male', seatNo: 12 }
      ],
      totalAmount: 1800,
      status: 'CANCELLED',
      bookingTime: '2024-01-12T16:45:00'
    }
  ])

  const [filteredBookings, setFilteredBookings] = useState(bookings)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    if (dateFilter) {
      filtered = filtered.filter(booking => booking.tripDate === dateFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter, dateFilter])

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  const handleCancelBooking = (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'CANCELLED' }
          : booking
      ))
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      CONFIRMED: 'status-badge status-confirmed',
      CANCELLED: 'status-badge status-cancelled',
      PENDING: 'status-badge status-pending'
    }
    return statusClasses[status] || 'status-badge'
  }

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
    revenue: bookings.filter(b => b.status === 'CONFIRMED').reduce((sum, b) => sum + b.totalAmount, 0)
  }

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div>
          <h1>Booking Management</h1>
          <p>Monitor and manage all bus bookings</p>
        </div>
      </div>

      <div className="bookings-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.confirmed}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">₹{stats.revenue.toLocaleString()}</div>
          <div className="stat-label">Revenue</div>
        </div>
      </div>

      <div className="bookings-filters">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by PNR, name, email, or bus number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="PENDING">Pending</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-date"
          />
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>PNR</th>
                <th>Passenger</th>
                <th>Bus & Route</th>
                <th>Journey Date</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td className="booking-pnr">{booking.pnr}</td>
                  <td>
                    <div className="passenger-info">
                      <div className="passenger-name">{booking.userName}</div>
                      <div className="passenger-email">{booking.userEmail}</div>
                    </div>
                  </td>
                  <td>
                    <div className="bus-info">
                      <div className="bus-number">{booking.busNumber}</div>
                      <div className="bus-route">{booking.route}</div>
                    </div>
                  </td>
                  <td>{new Date(booking.tripDate).toLocaleDateString()}</td>
                  <td>
                    <div className="seats-info">
                      {booking.seats.join(', ')} ({booking.seats.length} seats)
                    </div>
                  </td>
                  <td className="booking-amount">₹{booking.totalAmount}</td>
                  <td>
                    <span className={getStatusBadge(booking.status)}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleViewDetails(booking)}
                        className="btn btn-sm btn-outline"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      {booking.status === 'CONFIRMED' && (
                        <button 
                          onClick={() => handleCancelBooking(booking.id)}
                          className="btn btn-sm btn-danger"
                          title="Cancel Booking"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal booking-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Booking Details</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <div className="booking-details">
              <div className="detail-section">
                <h3>Booking Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>PNR</label>
                    <span>{selectedBooking.pnr}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <span className={getStatusBadge(selectedBooking.status)}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Booking Time</label>
                    <span>{new Date(selectedBooking.bookingTime).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Amount</label>
                    <span className="amount">₹{selectedBooking.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Journey Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Bus Number</label>
                    <span>{selectedBooking.busNumber}</span>
                  </div>
                  <div className="detail-item">
                    <label>Route</label>
                    <span>{selectedBooking.route}</span>
                  </div>
                  <div className="detail-item">
                    <label>Journey Date</label>
                    <span>{new Date(selectedBooking.tripDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Boarding - Dropping</label>
                    <span>{selectedBooking.fromStop} → {selectedBooking.toStop}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Passenger Details</h3>
                <div className="passengers-list">
                  {selectedBooking.passengers.map((passenger, index) => (
                    <div key={index} className="passenger-card">
                      <div className="passenger-info">
                        <div className="passenger-name">{passenger.name}</div>
                        <div className="passenger-details">
                          {passenger.age} years • {passenger.gender}
                        </div>
                      </div>
                      <div className="passenger-seat">
                        Seat {passenger.seatNo}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}