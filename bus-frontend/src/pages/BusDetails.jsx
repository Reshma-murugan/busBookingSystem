import { useParams, useSearchParams, Link } from 'react-router-dom'
import useFetch from '../hooks/useFetch'

export default function BusDetails() {
  const { busId } = useParams()
  const [searchParams] = useSearchParams()

  const { data: bus, loading, error } = useFetch({
    url: `/api/buses/${busId}`,
    auto: true,
    deps: [busId]
  })

  if (loading) return <div className="loading">Loading bus details...</div>
  if (error) return <div className="error-message">Error: {error.message}</div>
  if (!bus) return <div className="error-message">Bus not found</div>

  return (
    <div className="container">
      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{bus.name}</h1>
            <p className="text-secondary">{bus.route}</p>
          </div>
          <span className="bus-type">{bus.type}</span>
        </div>

        <div className="grid grid-2 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Journey Details</h3>
            <div className="text-sm">
              <p>Departure: {bus.departureTime}</p>
              <p>Arrival: {bus.arrivalTime}</p>
              <p>Duration: {bus.duration}</p>
              <p>Total Seats: {bus.totalSeats}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Amenities</h3>
            <div className="text-sm">
              {bus.amenities?.map((amenity, index) => (
                <p key={index}>✓ {amenity}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Route & Stops</h3>
          <div className="grid grid-3">
            {bus.stops?.map((stop, index) => (
              <div key={stop.id} className="text-sm p-4 bg-gray-50 rounded">
                <div className="font-medium">{stop.name}</div>
                <div className="text-secondary">{stop.arrivalTime}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Link 
            to={`/buses/${busId}/seats?${searchParams.toString()}`}
            className="btn btn-primary"
          >
            View Seats & Book
          </Link>
          <Link to="/results" className="btn btn-outline">
            Back to Results
          </Link>
        </div>
      </div>
    </div>
  )
}