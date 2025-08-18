import { useSearchParams, Link } from 'react-router-dom'
import useFetch from '../hooks/useFetch'

export default function Results() {
  const [searchParams] = useSearchParams()
  const fromCityId = searchParams.get('fromCityId')
  const toCityId = searchParams.get('toCityId')
  const date = searchParams.get('date')
  const seats = searchParams.get('seats') || '1'

  const { data, loading, error } = useFetch({
    url: `/api/buses/search?fromCityId=${fromCityId}&toCityId=${toCityId}&date=${date}&seats=${seats}`,
    auto: true,
    deps: [fromCityId, toCityId, date, seats]
  })

  if (loading) return <div className="loading">Searching buses...</div>
  if (error) return <div className="error-message">Error: {error.message}</div>

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="text-xl font-semibold mb-2">Available Buses</h1>
        <p className="text-secondary">
          {data?.fromCity} → {data?.toCity} on {new Date(date).toLocaleDateString()}
        </p>
      </div>

      {!data?.buses?.length ? (
        <div className="card text-center">
          <p>No buses found for your search criteria.</p>
          <Link to="/" className="btn btn-primary mt-4">
            Search Again
          </Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {data.buses.map(bus => (
            <div key={bus.id} className="bus-card">
              <div className="bus-card-header">
                <div>
                  <h3 className="bus-card-title">{bus.name}</h3>
                  <div className="bus-route">{bus.route}</div>
                </div>
                <span className="bus-type">{bus.type}</span>
              </div>

              <div className="bus-info">
                <span>Departure: {bus.departureTime}</span>
                <span>Arrival: {bus.arrivalTime}</span>
                <span>Duration: {bus.duration}</span>
              </div>

              <div className="bus-info">
                <span>Available: {bus.availableSeats} seats</span>
                <span>Price: ₹{bus.price}</span>
              </div>

              <div className="mt-4">
                <Link 
                  to={`/buses/${bus.id}?${searchParams.toString()}`}
                  className="btn btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}