export default function SeatLayout({ seats, selectedSeats, onSeatSelect }) {
  const handleSeatClick = (seatNo) => {
    if (seats.find(s => s.seatNo === seatNo)?.booked) return
    onSeatSelect(seatNo)
  }

  const getSeatClass = (seatNo) => {
    const seat = seats.find(s => s.seatNo === seatNo)
    if (seat?.booked) return 'seat booked'
    if (selectedSeats.includes(seatNo)) return 'seat selected'
    return 'seat available'
  }

  return (
    <div className="seat-layout">
      <div className="seat-grid">
        {Array.from({ length: 28 }, (_, i) => i + 1).map(seatNo => (
          <button
            key={seatNo}
            className={getSeatClass(seatNo)}
            onClick={() => handleSeatClick(seatNo)}
            disabled={seats.find(s => s.seatNo === seatNo)?.booked}
          >
            {seatNo}
          </button>
        ))}
      </div>
      
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-color legend-available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color legend-selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-color legend-booked"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  )
}