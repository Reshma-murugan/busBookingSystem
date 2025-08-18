import { useAuth } from '../contexts/AuthContext'
import useFetch from '../hooks/useFetch'

export default function Profile() {
  const { user } = useAuth()
  
  const { data: bookings, loading, error } = useFetch({
    url: '/api/user/bookings',
    auth: true,
    auto: true
  })

  return (
    <div className="container">
      <div className="card mb-4">
        <h1 className="text-xl font-semibold mb-4">Profile</h1>
        <div className="grid grid-2">
          <div>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Booking History</h2>
        
        {loading && <div className="loading">Loading bookings...</div>}
        {error && <div className="error-message">Error: {error.message}</div>}
        
        {bookings && bookings.length === 0 && (
          <p className="text-secondary">No bookings found.</p>
        )}

        {bookings && bookings.length > 0 && (
          <div className="grid">
            {bookings.map(booking => (
              <div key={booking.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{booking.busName}</h3>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {booking.status}
                  </span>
                </div>
                
                <div className="text-sm text-secondary mb-2">
                  <p>PNR: <strong>{booking.pnr}</strong></p>
                  <p>Date: {new Date(booking.tripDate).toLocaleDateString()}</p>
                  <p>Route: {booking.fromStop} → {booking.toStop}</p>
                  <p>Seats: {booking.seats.join(', ')}</p>
                </div>

                <div className="mt-2">
                  <h4 className="font-medium mb-1">Passengers:</h4>
                  {booking.passengers.map((passenger, index) => (
                    <div key={index} className="text-sm">
                      {passenger.name} ({passenger.age}yrs, {passenger.gender}) - Seat {passenger.seatNo}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}