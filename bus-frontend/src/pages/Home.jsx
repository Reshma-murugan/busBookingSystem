import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [searchForm, setSearchForm] = useState({
    fromCityId: '',
    toCityId: '',
    date: '',
    busType: 'ALL',
    seats: 1
  })

  const { data: cities } = useFetch({ 
    url: '/api/cities',
    auto: true 
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchForm.fromCityId || !searchForm.toCityId || !searchForm.date) {
      alert('Please fill all required fields')
      return
    }
    
    const params = new URLSearchParams(searchForm)
    navigate(`/results?${params.toString()}`)
  }

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Meghna Travels</h1>
          <p className="hero-subtitle">Your trusted partner for comfortable journeys across Tamil Nadu</p>
        </div>
      </div>

      <div className="container">
        <div className="search-section">
          <h2 className="search-title">Book Your Journey</h2>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-form-grid">
              <div className="form-group">
                <label className="form-label">From</label>
                <select
                  name="fromCityId"
                  value={searchForm.fromCityId}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select departure city</option>
                  {cities?.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">To</label>
                <select
                  name="toCityId"
                  value={searchForm.toCityId}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select destination city</option>
                  {cities?.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Journey Date</label>
                <input
                  type="date"
                  name="date"
                  value={searchForm.date}
                  onChange={handleInputChange}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bus Type</label>
                <select
                  name="busType"
                  value={searchForm.busType}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="ALL">All Types</option>
                  <option value="AC">AC</option>
                  <option value="NON_AC">Non-AC</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Passengers</label>
                <select
                  name="seats"
                  value={searchForm.seats}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="search-button-container">
              <button type="submit" className="btn btn-primary search-btn">
                Search Buses
              </button>
            </div>
          </form>
        </div>

        <div className="features-section">
          <h3 className="features-title">Why Choose Meghna Travels?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚌</div>
              <h4>35+ Modern Buses</h4>
              <p>Well-maintained fleet with AC and Non-AC options</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h4>Statewide Coverage</h4>
              <p>Connecting all 38 districts of Tamil Nadu</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h4>Punctual Service</h4>
              <p>On-time departures and arrivals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💺</div>
              <h4>Comfortable Seating</h4>
              <p>Spacious seats for a relaxing journey</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}