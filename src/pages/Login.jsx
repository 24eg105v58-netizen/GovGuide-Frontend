import { useState } from 'react'
import api from '../api'
import '../styles.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const res = await api.post('/auth/login', {
        email,
        password
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role
      }))

      window.location.href = '/schemes'
    } catch (error) {
      if (error.response) {
        setMessage(
          error.response.data?.message ||
          error.response.data?.error ||
          `Login failed (${error.response.status}). Check your email and password.`
        )
      } else {
        setMessage(
          'Cannot connect to the backend. Check that Spring Boot is running on port 8080.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="brand">
          <div className="brand-icon">🏛️</div>
          <div>
            <h2>GovGuide</h2>
            <p>Government Schemes, Made Simple</p>
          </div>
        </div>

        <div className="hero-content">
          <span className="hero-tag">YOUR GUIDE TO GOVERNMENT BENEFITS</span>
          <h1>Your benefits.<br />Your future.</h1>
          <p>
            Discover government schemes that may match your profile,
            understand eligibility, and find official application portals.
          </p>

          <div className="hero-features">
            <span>✓ Simple</span>
            <span>✓ Accessible</span>
            <span>✓ Informative</span>
          </div>
        </div>

        <p className="hero-footer">
          Helping you find the right opportunities.
        </p>
      </div>

      <div className="login-side">
        <form className="login-card" onSubmit={submit}>
          <div className="mobile-brand">🏛️ GovGuide</div>

          <div className="welcome-icon">👋</div>
          <h1>Welcome back!</h1>
          <p className="login-subtitle">
            Sign in to continue to your GovGuide account.
          </p>

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {message && (
            <p className="login-message" role="status">
              {message}
            </p>
          )}

          <button
            className="login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          <p className="signup-text">
            New to GovGuide?
          </p>

          <a className="create-account" href="/register">
            Create an account
          </a>

          <div className="login-note">
            Preliminary scheme information. Verify eligibility through
            official government sources.
          </div>
        </form>
      </div>
    </div>
  )
}
