import { useEffect, useState } from 'react';
import './Profile.css';

export default function Profile() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // In a real app we would decode JWT to show user info
    const token = localStorage.getItem('token');
    setEmail(token ? 'Logged in user' : 'Guest');
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <p>Status: {email}</p>
      <button onClick={logout} className="btn">Logout</button>
    </div>
  );
}
