import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../auth.jsx'
import { Button, Card, Input } from '../components/ui.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try { login(await api.login(email, password)); nav('/dashboard') } catch (err) { setError(err.message) }
  }

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="brand big">Campus<span>Room</span></div>
        <p>Pinjam ruangan kampus tanpa ribet. Cek jadwal, ajukan, dan pantau statusnya di satu tempat.</p>
      </div>
      <Card className="auth-card">
        <h2>Masuk</h2>
        <p className="muted">Gunakan email kampus kamu</p>
        <form onSubmit={submit}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@student.ac.id" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          {error && <p className="error">{error}</p>}
          <Button type="submit" className="btn btn-primary full">Masuk</Button>
        </form>
        <p className="muted center">Belum punya akun? <Link to="/register">Daftar</Link></p>
      </Card>
    </div>
  )
}
