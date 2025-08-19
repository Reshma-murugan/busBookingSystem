import { useState, useEffect } from 'react'
import { Plus, Edit, Wrench, Eye } from 'lucide-react'
import './Buses.css'

export default function Buses() {
  const [buses, setBuses] = useState([
    { id: 1, number: 'TN-01-AB-1234', type: 'AC', seats: 28, status: 'ACTIVE', lastMaintenance: '2024-01-15' },
    { id: 2, number: 'TN-02-CD-5678', type: 'NON_AC', seats: 35, status: 'ACTIVE', lastMaintenance: '2024-01-10' },
    { id: 3, number: 'TN-03-EF-9012', type: 'AC', seats: 28, status: 'MAINTENANCE', lastMaintenance: '2024-01-20' },
    { id: 4, number: 'TN-04-GH-3456', type: 'NON_AC', seats: 35, status: 'RESERVED', lastMaintenance: '2024-01-05' },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingBus, setEditingBus] = useState(null)
  const [formData, setFormData] = useState({
    number: '',
    type: 'AC',
    seats: 28,
    status: 'ACTIVE'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingBus) {
      setBuses(prev => prev.map(bus => 
        bus.id === editingBus.id 
          ? { ...bus, ...formData }
          : bus
      ))
    } else {
      const newBus = {
        id: Date.now(),
        ...formData,
        lastMaintenance: new Date().toISOString().split('T')[0]
      }
      setBuses(prev => [...prev, newBus])
    }
    
    setShowModal(false)
    setEditingBus(null)
    setFormData({ number: '', type: 'AC', seats: 28, status: 'ACTIVE' })
  }

  const handleEdit = (bus) => {
    setEditingBus(bus)
    setFormData({
      number: bus.number,
      type: bus.type,
      seats: bus.seats,
      status: bus.status
    })
    setShowModal(true)
  }

  const handleMaintenance = (busId) => {
    setBuses(prev => prev.map(bus => 
      bus.id === busId 
        ? { ...bus, status: 'MAINTENANCE', lastMaintenance: new Date().toISOString().split('T')[0] }
        : bus
    ))
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      ACTIVE: 'status-badge status-active',
      MAINTENANCE: 'status-badge status-maintenance',
      RESERVED: 'status-badge status-reserved',
      INACTIVE: 'status-badge status-inactive'
    }
    return statusClasses[status] || 'status-badge'
  }

  return (
    <div className="buses-page">
      <div className="page-header">
        <div>
          <h1>Bus Management</h1>
          <p>Manage your fleet of {buses.length} buses</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add Bus
        </button>
      </div>

      <div className="buses-stats">
        <div className="stat-item">
          <div className="stat-value">{buses.filter(b => b.status === 'ACTIVE').length}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{buses.filter(b => b.status === 'MAINTENANCE').length}</div>
          <div className="stat-label">Maintenance</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{buses.filter(b => b.status === 'RESERVED').length}</div>
          <div className="stat-label">Reserved</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{buses.filter(b => b.status === 'INACTIVE').length}</div>
          <div className="stat-label">Inactive</div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Bus Number</th>
                <th>Type</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Last Maintenance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map(bus => (
                <tr key={bus.id}>
                  <td className="bus-number">{bus.number}</td>
                  <td>
                    <span className={`type-badge type-${bus.type.toLowerCase()}`}>
                      {bus.type}
                    </span>
                  </td>
                  <td>{bus.seats}</td>
                  <td>
                    <span className={getStatusBadge(bus.status)}>
                      {bus.status}
                    </span>
                  </td>
                  <td>{new Date(bus.lastMaintenance).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEdit(bus)}
                        className="btn btn-sm btn-outline"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleMaintenance(bus.id)}
                        className="btn btn-sm btn-warning"
                        title="Schedule Maintenance"
                        disabled={bus.status === 'MAINTENANCE'}
                      >
                        <Wrench size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingBus ? 'Edit Bus' : 'Add New Bus'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Bus Number</label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="TN-01-AB-1234"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="AC">AC</option>
                  <option value="NON_AC">Non-AC</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Number of Seats</label>
                <select
                  name="seats"
                  value={formData.seats}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value={28}>28 (AC)</option>
                  <option value={35}>35 (Non-AC)</option>
                </select>
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
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {editingBus ? 'Update Bus' : 'Add Bus'}
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