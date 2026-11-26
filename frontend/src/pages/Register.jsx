import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { Button, Card, Input } from '../components/ui.jsx'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', role: 'mahasiswa', password: '' })
  const [error, setError] = useState('')
  const nav = useNavigate()
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    try { await api.register(form); nav('/login') } catch (err) { setError(err.message) }
  }

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="brand big">Campus<span>Room</span></div>
        <p>Buat akun untuk mulai meminjam ruangan kelas, lab, dan aula.</p>
      </div>
      <Card className="auth-card">
        <h2>Daftar Akun</h2>
        <form onSubmit={submit}>
          <Input label="Nama lengkap" value={form.name} onChange={set('name')} placeholder="Nama kamu" />
          <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="nama@student.ac.id" />
          <Input label="Jenis akun" type="select" value={form.role} onChange={set('role')}>
            <option value="mahasiswa">Mahasiswa</option>
            <option value="organisasi">Organisasi</option>
          </Input>
          <Input label="Password" type="password" value={form.password} onChange={set('password')} placeholder="Minimal 6 karakter" />
          {error && <p className="error">{error}</p>}
          <Button type="submit">Daftar</Button>
        </form>
        <p className="muted center">Sudah punya akun? <Link to="/login">Masuk</Link></p>
      </Card>
    </div>
  )
}
