import './SeatLayout.css';

export default function SeatLayout({ totalSeats = 28, bookedSeats = [], selectedSeats = [], onToggle }) {
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);
  const isBooked = (n) => bookedSeats.includes(n);
  const isSelected = (n) => selectedSeats.includes(n);

  const rows = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }

  return (
    <div className="seat-layout">
      {rows.map((row, idx) => (
        <div className="seat-row" key={idx}>
          {/* left pair */}
          <div className="seat-pair">
            {row.slice(0, 2).map((n) => (
              <button
                key={n}
                className={`seat ${isBooked(n) ? 'booked' : isSelected(n) ? 'selected' : 'available'}`}
                onClick={() => !isBooked(n) && onToggle?.(n)}
                disabled={isBooked(n)}
                title={`Seat ${n}`}
              >{n}</button>
            ))}
          </div>
          {/* aisle */}
          <div className="aisle" />
          {/* right pair */}
          <div className="seat-pair">
            {row.slice(2, 4).map((n) => (
              <button
                key={n}
                className={`seat ${isBooked(n) ? 'booked' : isSelected(n) ? 'selected' : 'available'}`}
                onClick={() => !isBooked(n) && onToggle?.(n)}
                disabled={isBooked(n)}
                title={`Seat ${n}`}
              >{n}</button>
            ))}
          </div>
        </div>
      ))}
      <div className="legend">
        <span className="legend-item"><span className="dot available" /> Available</span>
        <span className="legend-item"><span className="dot selected" /> Selected</span>
        <span className="legend-item"><span className="dot booked" /> Booked</span>
      </div>
    </div>
  );
}
