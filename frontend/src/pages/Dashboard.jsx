import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../auth.jsx'
import { Button, Card, StatCard, StatusBadge } from '../components/ui.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const nav = useNavigate()
  useEffect(() => { api.bookings(user.role === 'admin' ? null : user.id).then(setBookings) }, [user])

  const count = (s) => bookings.filter((b) => b.status === s).length
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Halo, {user.name.split(' ')[0]} 👋</h1>
          <p className="muted">Ringkasan peminjaman ruangan kamu</p>
        </div>
        <Button onClick={() => nav('/rooms')}>+ Pinjam Ruangan</Button>
      </div>
      <div className="stats">
        <StatCard label="Total Peminjaman" value={bookings.length} accent="#1E3A8A" />
        <StatCard label="Menunggu" value={count('pending')} accent="#F59E0B" />
        <StatCard label="Disetujui" value={count('approved')} accent="#16A34A" />
        <StatCard label="Ditolak" value={count('rejected')} accent="#DC2626" />
      </div>
      <Card>
        <h3>Peminjaman Terbaru</h3>
        <table>
          <thead><tr><th>Ruangan</th><th>Tanggal</th><th>Jam</th><th>Keperluan</th><th>Status</th></tr></thead>
          <tbody>
            {bookings.slice(-5).reverse().map((b) => (
              <tr key={b.id}><td>{b.room_name}</td><td>{b.date}</td><td>{b.start}–{b.end}</td><td>{b.purpose}</td><td><StatusBadge status={b.status} /></td></tr>
            ))}
            {!bookings.length && <tr><td colSpan="5" className="muted center">Belum ada peminjaman</td></tr>}
          </tbody>
        </table>
      </Card>
    </>
  )
}
