import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Bus Booking. All rights reserved.</p>
    </footer>
  );
}
