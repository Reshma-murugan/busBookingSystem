import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import SeatLayout from '../components/SeatLayout'

export default function SeatBooking() {
  const { busId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [selectedSeats, setSelectedSeats] = useState([])
  const [fromStopId, setFromStopId] = useState('')
  const [toStopId, setToStopId] = useState('')
  
  const date = searchParams.get('date')
  const seats = parseInt(searchParams.get('seats') || '1')

  const { data: bus } = useFetch({
    url: `/api/buses/${busId}`,
    auto: true,
    deps: [busId]
  })

  const { data: seatData, loading, error, refetch } = useFetch({
    url: fromStopId && toStopId ? `/api/buses/${busId}/seats?fromStopId=${fromStopId}&toStopId=${toStopId}&date=${date}` : '',
    auto: false,
    deps: [busId, fromStopId, toStopId, date]
  })

  useEffect(() => {
    if (fromStopId && toStopId) {
      refetch()
      setSelectedSeats([])
    }
  }, [fromStopId, toStopId, refetch])

  const handleSeatSelect = (seatNo) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNo)) {
        return prev.filter(s => s !== seatNo)
      } else if (prev.length < seats) {
        return [...prev, seatNo]
      }
      return prev
    })
  }

  const handleProceedToCheckout = () => {
    if (!fromStopId || !toStopId || selectedSeats.length === 0) {
      alert('Please select boarding/dropping stops and seats')
      return
    }

    const bookingData = {
      busId: parseInt(busId),
      date,
      fromStopId: parseInt(fromStopId),
      toStopId: parseInt(toStopId),
      seatIds: selectedSeats,
      totalPrice: selectedSeats.length * (bus?.price || 500)
    }

    sessionStorage.setItem('bookingData', JSON.stringify(bookingData))
    navigate('/checkout')
  }

  if (!bus) return <div className="loading">Loading...</div>

  return (
    <div className="container">
      <div className="card mb-4">
        <h1 className="text-xl font-semibold mb-4">Select Seats - {bus.name}</h1>
        <p className="text-secondary mb-4">{bus.route} on {new Date(date).toLocaleDateString()}</p>

        <div className="grid grid-2 mb-6">
          <div className="form-group">
            <label className="form-label">Boarding Stop</label>
            <select
              value={fromStopId}
              onChange={(e) => setFromStopId(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select boarding stop</option>
              {bus.stops?.map(stop => (
                <option key={stop.id} value={stop.id}>
                  {stop.name} - {stop.arrivalTime}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Dropping Stop</label>
            <select
              value={toStopId}
              onChange={(e) => setToStopId(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select dropping stop</option>
              {bus.stops?.map(stop => (
                <option key={stop.id} value={stop.id}>
                  {stop.name} - {stop.arrivalTime}
                </option>
              ))}
            </select>
          </div>
        </div>

        {fromStopId && toStopId && (
          <>
            {loading && <div className="loading">Loading seat availability...</div>}
            {error && <div className="error-message">Error: {error.message}</div>}
            
            {seatData && (
              <>
                <div className="mb-4">
                  <p className="text-sm text-secondary">
                    Select {seats} seat{seats > 1 ? 's' : ''} ({selectedSeats.length} selected)
                  </p>
                </div>

                <SeatLayout
                  seats={seatData.seats || []}
                  selectedSeats={selectedSeats}
                  onSeatSelect={handleSeatSelect}
                />

                {selectedSeats.length > 0 && (
                  <div className="booking-summary">
                    <h3 className="font-semibold mb-2">Booking Summary</h3>
                    <div className="booking-summary-item">
                      <span>Selected Seats:</span>
                      <span>{selectedSeats.join(', ')}</span>
                    </div>
                    <div className="booking-summary-item">
                      <span>Price per seat:</span>
                      <span>₹{bus.price || 500}</span>
                    </div>
                    <div className="booking-summary-item booking-summary-total">
                      <span>Total Amount:</span>
                      <span>₹{selectedSeats.length * (bus.price || 500)}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={selectedSeats.length === 0}
                    className="btn btn-primary"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline"
                  >
                    Back
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}