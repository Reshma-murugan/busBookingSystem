import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './BusDetails.css';

export default function BusDetails() {
  const { state } = useLocation();
  const { busId } = useParams();
  const navigate = useNavigate();
  const bus = state?.bus;

  const [fromStopId, setFromStopId] = useState('');
  const [toStopId, setToStopId] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (bus && bus.stops?.length) {
      setFromStopId(bus.stops[0].id);
      setToStopId(bus.stops[bus.stops.length - 1].id);
    }
  }, [bus]);

  const canProceed = useMemo(() => !!(fromStopId && toStopId && date && Number(fromStopId) !== Number(toStopId)), [fromStopId, toStopId, date]);

  if (!bus) {
    return <div className="bus-details"><p>Bus data missing. Go back and select a bus again.</p></div>;
  }

  return (
    <div className="bus-details">
      <h2>{bus.name} <small className="type">{bus.type}</small></h2>
      <p>Total Seats: {bus.totalSeats}</p>
      <div className="stops">
        <h4>Stops</h4>
        <ol>
          {bus.stops?.map(s => <li key={s.id}>{s.sequence}. {s.name}</li>)}
        </ol>
      </div>

      <div className="selectors">
        <label>
          From Stop
          <select value={fromStopId} onChange={e=>setFromStopId(e.target.value)}>
            {bus.stops?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label>
          To Stop
          <select value={toStopId} onChange={e=>setToStopId(e.target.value)}>
            {bus.stops?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </label>
      </div>

      <button disabled={!canProceed} className="btn"
        onClick={() => navigate(`/booking/${busId}`, { state: { bus, fromStopId: Number(fromStopId), toStopId: Number(toStopId), date } })}
      >Proceed to Seat Selection</button>
    </div>
  );
}
