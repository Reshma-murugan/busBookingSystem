import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';

export default function Search() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!from || !to || !date) return;
    navigate(`/buses?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
  };

  return (
    <div className="search-page">
      <h2>Search Buses</h2>
      <form className="search-form" onSubmit={submit}>
        <input placeholder="From" value={from} onChange={e=>setFrom(e.target.value)} />
        <input placeholder="To" value={to} onChange={e=>setTo(e.target.value)} />
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
