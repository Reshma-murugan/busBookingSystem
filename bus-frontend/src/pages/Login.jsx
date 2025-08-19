import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import useFetch from '../hooks/useFetch'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, isAuthenticated } = useAuth()
  
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const { refetch: submitAuth, loading, error } = useFetch({
    url: isRegisterMode ? '/api/auth/register' : '/api/auth/login',
    method: 'POST',
    auto: false
  })

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/'
      navigate(redirect, { replace: true })
    }
  }, [isAuthenticated, navigate, searchParams])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const payload = isRegisterMode 
        ? formData 
        : { email: formData.email, password: formData.password }
      
      const result = await submitAuth(payload)
      
      if (result?.accessToken) {
        login(result.accessToken, {
          id: result.userId,
          name: result.name,
          email: result.email,
          role: result.role
        })
        const redirect = searchParams.get('redirect') || '/'
        navigate(redirect, { replace: true })
      }
    } catch (err) {
      // Error is handled by useFetch
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h1 className="text-xl font-semibold mb-4 text-center">
          {isRegisterMode ? 'Create Account' : 'Login'}
        </h1>

        <form onSubmit={handleSubmit}>
          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          {error && (
            <div className="error-message mb-4">
              {error.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full mb-4"
            style={{ width: '100%' }}
          >
            {loading ? 'Please wait...' : (isRegisterMode ? 'Register' : 'Login')}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="btn btn-outline"
          >
            {isRegisterMode ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>

        {!isRegisterMode && (
          <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
            <strong>Demo Account:</strong><br />
            Email: demo@user.com<br />
            Password: password
          </div>
        )}
      </div>
    </div>
  )
}