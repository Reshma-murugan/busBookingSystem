import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function BookingSuccess() {
  const navigate = useNavigate()
  const [bookingResult, setBookingResult] = useState(null)

  useEffect(() => {
    const result = sessionStorage.getItem('bookingResult')
    if (!result) {
      navigate('/')
      return
    }

    setBookingResult(JSON.parse(result))
  }, [navigate])

  if (!bookingResult) return <div className="loading">Loading...</div>

  return (
    <div className="container">
      <div className="card text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-4 text-green-600">Booking Confirmed!</h1>
        
        <div className="booking-summary mb-6">
          <h3 className="font-semibold mb-4">Booking Details</h3>
          <div className="booking-summary-item">
            <span>PNR:</span>
            <span className="font-bold">{bookingResult.pnr}</span>
          </div>
          <div className="booking-summary-item">
            <span>Booking ID:</span>
            <span>{bookingResult.bookingId}</span>
          </div>
        </div>

        <p className="text-secondary mb-6">
          Your booking has been confirmed. You will receive a confirmation email shortly.
          Please save your PNR for future reference.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/profile" className="btn btn-primary">
            View Booking History
          </Link>
          <Link to="/" className="btn btn-outline">
            Book Another Trip
          </Link>
        </div>
      </div>
    </div>
  )
}