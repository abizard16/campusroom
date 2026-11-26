import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../auth.jsx'
import { Button, Card, Input } from '../components/ui.jsx'

export default function BookRoom() {
  const { id } = useParams()
  const { user } = useAuth()
  const nav = useNavigate()
  const [room, setRoom] = useState(null)
  const [form, setForm] = useState({ date: '2026-12-05', start: '10:00', end: '12:00', purpose: '' })
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  useEffect(() => { api.room(id).then(setRoom) }, [id])

  const submit = async (e) => {
    e.preventDefault()
    try {
      await api.createBooking({ ...form, room_id: Number(id), user_id: user.id })
      nav('/my-bookings')
    } catch (err) { setError(err.message) }
  }

  if (!room) return null
  return (
    <>
      <div className="page-head"><div><h1>Ajukan Peminjaman</h1><p className="muted">Isi detail peminjaman ruangan</p></div></div>
      <div className="two-col">
        <Card>
          <form onSubmit={submit}>
            <Input label="Tanggal" type="date" value={form.date} onChange={set('date')} />
            <div className="row">
              <Input label="Jam mulai" type="time" value={form.start} onChange={set('start')} />
              <Input label="Jam selesai" type="time" value={form.end} onChange={set('end')} />
            </div>
            <Input label="Keperluan" type="textarea" value={form.purpose} onChange={set('purpose')} placeholder="Contoh: rapat divisi acara" />
            {error && <p className="error">{error}</p>}
            <div className="row">
              <Button variant="secondary" type="button" onClick={() => nav('/rooms')}>Batal</Button>
              <Button type="submit">Ajukan</Button>
            </div>
          </form>
        </Card>
        <Card className="summary">
          <div className="room-thumb big">{room.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</div>
          <h3>{room.name}</h3>
          <p className="muted">{room.building}</p>
          <p>Kapasitas: <b>{room.capacity} orang</b></p>
          <div className="chips">{room.facilities.map((f) => <span key={f} className="chip">{f}</span>)}</div>
          <p className="note">Sistem otomatis menolak pengajuan jika jadwal bentrok dengan peminjaman lain.</p>
        </Card>
      </div>
    </>
  )
}
