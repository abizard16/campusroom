import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../auth.jsx'
import { Button, Card, StatusBadge } from '../components/ui.jsx'

export default function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const load = () => api.bookings(user.id).then(setBookings)
  useEffect(() => { load() }, [])

  const cancel = async (id) => { await api.deleteBooking(id); load() }

  return (
    <>
      <div className="page-head"><div><h1>Peminjaman Saya</h1><p className="muted">Riwayat dan status pengajuan</p></div></div>
      <Card>
        <table>
          <thead><tr><th>Ruangan</th><th>Tanggal</th><th>Jam</th><th>Keperluan</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.room_name}</td><td>{b.date}</td><td>{b.start}–{b.end}</td><td>{b.purpose}</td>
                <td><StatusBadge status={b.status} /></td>
                <td>{b.status === 'pending' && <Button variant="danger" onClick={() => cancel(b.id)}>Batalkan</Button>}</td>
              </tr>
            ))}
            {!bookings.length && <tr><td colSpan="6" className="muted center">Belum ada peminjaman</td></tr>}
          </tbody>
        </table>
      </Card>
    </>
  )
}
