import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import './Schedule.css'

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [schedules, setSchedules] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [formData, setFormData] = useState({
    busId: '',
    routeId: '',
    departureTime: '',
    arrivalTime: ''
  })

  const buses = [
    { id: 1, number: 'TN-01-AB-1234', type: 'AC', status: 'ACTIVE' },
    { id: 2, number: 'TN-02-CD-5678', type: 'NON_AC', status: 'ACTIVE' },
    { id: 3, number: 'TN-04-GH-3456', type: 'NON_AC', status: 'ACTIVE' },
  ]

  const routes = [
    { id: 1, name: 'Chennai → Madurai', distance: '462 km', duration: '8h' },
    { id: 2, name: 'Coimbatore → Salem', distance: '160 km', duration: '3h' },
    { id: 3, name: 'Trichy → Chennai', distance: '320 km', duration: '6h' },
    { id: 4, name: 'Kanyakumari → Chennai', distance: '705 km', duration: '12h' },
  ]

  // Sample schedule data
  useEffect(() => {
    const sampleSchedules = {}
    const today = new Date()
    
    for (let i = 0; i < 31; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateKey = date.toISOString().split('T')[0]
      
      sampleSchedules[dateKey] = [
        {
          id: 1,
          busNumber: 'TN-01-AB-1234',
          route: 'Chennai → Madurai',
          departureTime: '22:00',
          arrivalTime: '06:00'
        },
        {
          id: 2,
          busNumber: 'TN-02-CD-5678',
          route: 'Coimbatore → Salem',
          departureTime: '08:00',
          arrivalTime: '11:00'
        }
      ]
    }
    
    setSchedules(sampleSchedules)
  }, [])

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const dateKey = selectedDate.toISOString().split('T')[0]
    const selectedBus = buses.find(b => b.id === parseInt(formData.busId))
    const selectedRoute = routes.find(r => r.id === parseInt(formData.routeId))
    
    const newSchedule = {
      id: Date.now(),
      busNumber: selectedBus?.number,
      route: selectedRoute?.name,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime
    }
    
    setSchedules(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newSchedule]
    }))
    
    setShowModal(false)
    setFormData({ busId: '', routeId: '', departureTime: '', arrivalTime: '' })
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dateKey = date.toISOString().split('T')[0]
      const daySchedules = schedules[dateKey] || []
      const isToday = date.toDateString() === new Date().toDateString()
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className="calendar-day-number">{day}</div>
          <div className="calendar-schedules">
            {daySchedules.slice(0, 2).map(schedule => (
              <div key={schedule.id} className="calendar-schedule">
                {schedule.busNumber} - {schedule.route.split(' → ')[1]}
              </div>
            ))}
            {daySchedules.length > 2 && (
              <div className="calendar-schedule-more">
                +{daySchedules.length - 2} more
              </div>
            )}
          </div>
        </div>
      )
    }
    
    return days
  }

  return (
    <div className="schedule-page">
      <div className="page-header">
        <div>
          <h1>Schedule Management</h1>
          <p>31-day bus scheduling and route planning</p>
        </div>
      </div>

      <div className="schedule-calendar">
        <div className="calendar-header">
          <button onClick={() => navigateMonth(-1)} className="btn btn-outline">
            <ChevronLeft size={16} />
          </button>
          <h2>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => navigateMonth(1)} className="btn btn-outline">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {renderCalendar()}
        </div>
      </div>

      <div className="schedule-summary">
        <div className="card">
          <h3>Fleet Utilization</h3>
          <div className="utilization-stats">
            <div className="util-item">
              <div className="util-value">28/35</div>
              <div className="util-label">Buses Scheduled Today</div>
            </div>
            <div className="util-item">
              <div className="util-value">80%</div>
              <div className="util-label">Fleet Utilization</div>
            </div>
            <div className="util-item">
              <div className="util-value">5</div>
              <div className="util-label">Available for Emergency</div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Schedule Bus - {selectedDate?.toLocaleDateString()}
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
                <label className="form-label">Select Bus</label>
                <select
                  name="busId"
                  value={formData.busId}
                  onChange={(e) => setFormData(prev => ({ ...prev, busId: e.target.value }))}
                  className="form-select"
                  required
                >
                  <option value="">Choose available bus</option>
                  {buses.filter(bus => bus.status === 'ACTIVE').map(bus => (
                    <option key={bus.id} value={bus.id}>
                      {bus.number} ({bus.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Route</label>
                <select
                  name="routeId"
                  value={formData.routeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, routeId: e.target.value }))}
                  className="form-select"
                  required
                >
                  <option value="">Choose route</option>
                  {routes.map(route => (
                    <option key={route.id} value={route.id}>
                      {route.name} ({route.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Departure Time</label>
                  <input
                    type="time"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, departureTime: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Arrival Time</label>
                  <input
                    type="time"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, arrivalTime: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Schedule Bus
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