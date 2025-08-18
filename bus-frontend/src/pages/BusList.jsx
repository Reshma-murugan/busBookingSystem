import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import BusCard from '../components/BusCard.jsx';
import './BusList.css';

export default function BusList() {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const date = params.get('date') || '';

  const { data, error, loading } = useFetch(`/buses/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);

  return (
    <div className="bus-list-page">
      <h2>Available Buses</h2>
      <p className="criteria">{from} → {to} on {date}</p>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error.message}</p>}
      <div className="list">
        {data?.buses?.length ? data.buses.map(bus => (
          <BusCard key={bus.id} bus={bus} />
        )) : !loading && <p>No buses found.</p>}
      </div>
    </div>
  );
}
