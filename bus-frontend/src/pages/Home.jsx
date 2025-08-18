import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <h1>Welcome to Bus Booking</h1>
      <p>Find buses, check seat availability, and book your journey.</p>
      <Link className="btn" to="/search">Search Buses</Link>
    </div>
  );
}
