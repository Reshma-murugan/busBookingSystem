import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8080'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      const redirect = location.state?.redirectTo || '/profile';
      navigate(redirect, { replace: true, state: location.state?.payload });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={submit} className="login-form">
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading} type="submit">{loading ? 'Signing in...' : 'Login'}</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
