import { Link } from 'react-router-dom';
import './BusCard.css';

export default function BusCard({ bus }) {
  return (
    <div className="bus-card">
      <div className="bus-card-header">
        <h3>{bus.name}</h3>
        <span className={`type ${bus.type?.toLowerCase().includes('ac') ? 'ac' : 'nonac'}`}>{bus.type}</span>
      </div>
      <div className="bus-card-body">
        <p>Total Seats: {bus.totalSeats}</p>
        <p>Stops: {bus.stops?.map(s => s.name).join(' → ')}</p>
      </div>
      <div className="bus-card-actions">
        <Link to={`/bus/${bus.id}`} state={{ bus }} className="btn">View</Link>
      </div>
    </div>
  );
}
