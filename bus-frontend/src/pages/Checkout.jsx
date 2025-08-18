import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useFetch from '../hooks/useFetch'

export default function Checkout() {
  const navigate = useNavigate()
  const [bookingData, setBookingData] = useState(null)
  const [passengers, setPassengers] = useState([])

  const { refetch: createBooking, loading } = useFetch({
    url: '/api/bookings',
    method: 'POST',
    auth: true,
    auto: false
  })

  useEffect(() => {
    const savedBookingData = sessionStorage.getItem('bookingData')
    if (!savedBookingData) {
      navigate('/')
      return
    }

    const data = JSON.parse(savedBookingData)
    setBookingData(data)
    
    // Initialize passenger forms
    const initialPassengers = data.seatIds.map((seatId, index) => ({
      seatNo: seatId,
      name: '',
      age: '',
      gender: 'Male'
    }))
    setPassengers(initialPassengers)
  }, [navigate])

  const handlePassengerChange = (index, field, value) => {
    setPassengers(prev => prev.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    ))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all passengers have required info
    const isValid = passengers.every(p => p.name.trim() && p.age)
    if (!isValid) {
      alert('Please fill all passenger details')
      return
    }

    try {
      const bookingRequest = {
        busId: bookingData.busId,
        tripDate: bookingData.date,
        fromStopId: bookingData.fromStopId,
        toStopId: bookingData.toStopId,
        seatIds: bookingData.seatIds,
        passengers: passengers
      }

      const result = await createBooking(bookingRequest)
      
      if (result) {
        sessionStorage.removeItem('bookingData')
        sessionStorage.setItem('bookingResult', JSON.stringify(result))
        navigate('/booking-success')
      }
    } catch (error) {
      alert('Booking failed: ' + error.message)
    }
  }

  if (!bookingData) return <div className="loading">Loading...</div>

  return (
    <div className="container">
      <div className="card">
        <h1 className="text-xl font-semibold mb-4">Passenger Details</h1>
        
        <div className="booking-summary mb-6">
          <h3 className="font-semibold mb-2">Journey Summary</h3>
          <div className="booking-summary-item">
            <span>Date:</span>
            <span>{new Date(bookingData.date).toLocaleDateString()}</span>
          </div>
          <div className="booking-summary-item">
            <span>Seats:</span>
            <span>{bookingData.seatIds.join(', ')}</span>
          </div>
          <div className="booking-summary-item booking-summary-total">
            <span>Total Amount:</span>
            <span>₹{bookingData.totalPrice}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {passengers.map((passenger, index) => (
            <div key={index} className="passenger-form">
              <h3>Passenger {index + 1} (Seat {passenger.seatNo})</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Age *</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={passenger.age}
                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    value={passenger.gender}
                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                    className="form-select"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}