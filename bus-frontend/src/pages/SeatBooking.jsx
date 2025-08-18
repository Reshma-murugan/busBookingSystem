import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import SeatLayout from '../components/SeatLayout.jsx';
import './SeatBooking.css';

export default function SeatBooking() {
  const { state } = useLocation();
  const { busId } = useParams();
  const navigate = useNavigate();

  const bus = state?.bus;
  const fromStopId = state?.fromStopId;
  const toStopId = state?.toStopId;
  const date = state?.date;

  const paramsReady = useMemo(() => !!(fromStopId && toStopId && date), [fromStopId, toStopId, date]);

  const { data: seatData, loading, error, refetch } = useFetch(
    paramsReady ? `/buses/${busId}/seats?fromStopId=${fromStopId}&toStopId=${toStopId}&date=${date}` : '',
    { skip: !paramsReady }
  );

  const totalSeats = seatData?.totalSeats || bus?.totalSeats || 0;
  const bookedSeats = seatData?.bookedSeats || [];
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
  }, [fromStopId, toStopId, date, busId]);

  const toggleSeat = (n) => {
    setSelected((prev) => (prev.includes(n) ? prev.filter((s) => s !== n) : [...prev, n]));
  };

  const book = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { redirectTo: location.pathname, payload: state } });
      return;
    }
    const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8080'}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ busId: Number(busId), seatNumbers: selected, fromStopId, toStopId, date }),
    });
    if (res.ok) {
      setSelected([]);
      await refetch();
      alert('Booking successful!');
    } else {
      const payload = await res.json().catch(() => ({}));
      alert(payload.message || 'Booking failed');
    }
  };

  if (!bus || !paramsReady) return <div className="seat-booking"><p>Missing trip details. Go back and select stops/date.</p></div>;

  return (
    <div className="seat-booking">
      <h2>{bus.name} - Seat Selection</h2>
      <p className="trip">{bus.stops?.find(s=>s.id===fromStopId)?.name} → {bus.stops?.find(s=>s.id===toStopId)?.name} on {date}</p>
      {loading && <p>Loading seat availability...</p>}
      {error && <p className="error">{error.message}</p>}
      {!loading && (
        <>
          <SeatLayout totalSeats={totalSeats} bookedSeats={bookedSeats} selectedSeats={selected} onToggle={toggleSeat} />
          <div className="actions">
            <button disabled={!selected.length} onClick={book} className="btn">Confirm Booking ({selected.length})</button>
            <button onClick={()=>navigate(-1)} className="btn secondary">Back</button>
          </div>
        </>
      )}
    </div>
  );
}
