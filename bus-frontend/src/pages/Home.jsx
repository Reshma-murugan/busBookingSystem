import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFetch from '../hooks/useFetch'

export default function Home() {
  const navigate = useNavigate()
  const [searchForm, setSearchForm] = useState({
    fromCityId: '',
    toCityId: '',
    date: '',
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
      alert('Please fill all fields')
      return
    }
    
    const params = new URLSearchParams(searchForm)
    navigate(`/results?${params.toString()}`)
  }

  return (
    <div className="container">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Find Your Perfect Bus Journey</h1>
        <p className="text-secondary">Book comfortable and affordable bus tickets</p>
      </div>

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
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              value={searchForm.date}
              onChange={handleInputChange}
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
              required
            />
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

        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Search Buses
          </button>
        </div>
      </form>
    </div>
  )
}