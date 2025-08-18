import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import BusList from './pages/BusList.jsx';
import BusDetails from './pages/BusDetails.jsx';
import SeatBooking from './pages/SeatBooking.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Contact from './pages/Contact.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/buses" element={<BusList />} />
            <Route path="/bus/:busId" element={<BusDetails />} />
            <Route path="/booking/:busId" element={<SeatBooking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
