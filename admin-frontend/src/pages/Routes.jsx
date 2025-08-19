import { useState } from 'react'
import { Plus, Edit, MapPin } from 'lucide-react'
import './Routes.css'

export default function Routes() {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: 'Chennai → Madurai',
      source: 'Chennai',
      destination: 'Madurai',
      distance: 462,
      duration: '8h',
      stops: ['Tindivanam', 'Villupuram', 'Trichy'],
      price: 800,
      status: 'ACTIVE'
    },
    {
      id: 2,
      name: 'Coimbatore → Salem',
      source: 'Coimbatore',
      destination: 'Salem',
      distance: 160,
      duration: '3h',
      stops: ['Erode'],
      price: 450,
      status: 'ACTIVE'
    },
    {
      id: 3,
      name: 'Kanyakumari → Chennai',
      source: 'Kanyakumari',
      destination: 'Chennai',
      distance: 705,
      duration: '12h',
      stops: ['Nagercoil', 'Tirunelveli', 'Madurai', 'Trichy', 'Villupuram'],
      price: 1200,
      status: 'ACTIVE'
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingRoute, setEditingRoute] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    source: '',
    destination: '',
    distance: '',
    duration: '',
    stops: '',
    price: '',
    status: 'ACTIVE'
  })

  const cities = [
    'Chennai', 'Madurai', 'Coimbatore', 'Salem', 'Trichy', 'Kanyakumari',
    'Villupuram', 'Erode', 'Tirunelveli', 'Nagercoil', 'Tindivanam',
    'Vellore', 'Thanjavur', 'Karur', 'Dindigul', 'Sivakasi'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const routeData = {
      ...formData,
      distance: parseInt(formData.distance),
      price: parseInt(formData.price),
      stops: formData.stops.split(',').map(s => s.trim()).filter(s => s)
    }
    
    if (editingRoute) {
      setRoutes(prev => prev.map(route => 
        route.id === editingRoute.id 
          ? { ...route, ...routeData }
          : route
      ))
    } else {
      const newRoute = {
        id: Date.now(),
        ...routeData
      }
      setRoutes(prev => [...prev, newRoute])
    }
    
    setShowModal(false)
    setEditingRoute(null)
    setFormData({
      name: '', source: '', destination: '', distance: '',
      duration: '', stops: '', price: '', status: 'ACTIVE'
    })
  }

  const handleEdit = (route) => {
    setEditingRoute(route)
    setFormData({
      name: route.name,
      source: route.source,
      destination: route.destination,
      distance: route.distance.toString(),
      duration: route.duration,
      stops: route.stops.join(', '),
      price: route.price.toString(),
      status: route.status
    })
    setShowModal(true)
  }

  return (
    <div className="routes-page">
      <div className="page-header">
        <div>
          <h1>Route Management</h1>
          <p>Manage bus routes across Tamil Nadu</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add Route
        </button>
      </div>

      <div className="routes-grid">
        {routes.map(route => (
          <div key={route.id} className="route-card">
            <div className="route-header">
              <h3 className="route-name">{route.name}</h3>
              <span className={`status-badge status-${route.status.toLowerCase()}`}>
                {route.status}
              </span>
            </div>
            
            <div className="route-info">
              <div className="route-detail">
                <MapPin size={16} className="route-icon" />
                <span>{route.distance} km • {route.duration}</span>
              </div>
              <div className="route-price">₹{route.price}</div>
            </div>

            <div className="route-stops">
              <h4>Stops:</h4>
              <div className="stops-list">
                <span className="stop-item source">{route.source}</span>
                {route.stops.map((stop, index) => (
                  <span key={index} className="stop-item">{stop}</span>
                ))}
                <span className="stop-item destination">{route.destination}</span>
              </div>
            </div>

            <div className="route-actions">
              <button 
                onClick={() => handleEdit(route)}
                className="btn btn-outline btn-sm"
              >
                <Edit size={14} />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal large-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingRoute ? 'Edit Route' : 'Add New Route'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Source City</label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select source</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Destination City</label>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select destination</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Route Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Chennai → Madurai"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Distance (km)</label>
                  <input
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 8h"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Intermediate Stops</label>
                <input
                  type="text"
                  name="stops"
                  value={formData.stops}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Comma-separated stops (e.g., Tindivanam, Villupuram, Trichy)"
                />
                <small className="form-help">Enter stops in order, separated by commas</small>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {editingRoute ? 'Update Route' : 'Add Route'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}