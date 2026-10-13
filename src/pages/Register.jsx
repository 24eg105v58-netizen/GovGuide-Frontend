import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import '../styles.css'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      await api.post('/auth/register', {
  name,
  email,
  password
})

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
      setMessage(
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.response
          ? `Registration failed (${error.response.status}).`
          : 'Cannot connect to the backend. Check that Spring Boot is running.')
      )
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
          <span className="hero-tag">START YOUR JOURNEY</span>
          <h1>Discover benefits meant for you.</h1>
          <p>
            Create your account to explore government schemes,
            understand eligibility, and find official application portals.
          </p>
        </div>

        <p className="hero-footer">Your guide to government benefits.</p>
      </div>

      <div className="login-side">
        <form className="login-card" onSubmit={submit}>
          <h1>Create account</h1>
          <p className="login-subtitle">
            Join GovGuide to get started.
          </p>

          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
            required
          />

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
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />

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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="signup-text">Already have an account?</p>
          <Link className="create-account" to="/login">
            Sign in
          </Link>
        </form>
      </div>
    </div>
  )
}
