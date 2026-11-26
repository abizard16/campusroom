import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Button, Card, Input, StatusBadge } from '../components/ui.jsx'

export default function Admin() {
  const [bookings, setBookings] = useState([])
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState({ name: '', building: '', capacity: '' })
  const load = () => { api.bookings().then(setBookings); api.rooms().then(setRooms) }
  useEffect(load, [])

  const setStatus = async (id, status) => { await api.updateBooking(id, { status }); load() }
  const addRoom = async (e) => {
    e.preventDefault()
    await api.createRoom({ ...form, capacity: Number(form.capacity), facilities: [] })
    setForm({ name: '', building: '', capacity: '' }); load()
  }

  return (
    <>
      <div className="page-head"><div><h1>Panel Admin</h1><p className="muted">Kelola pengajuan dan data ruangan</p></div></div>
      <Card>
        <h3>Pengajuan Peminjaman</h3>
        <table>
          <thead><tr><th>Peminjam</th><th>Ruangan</th><th>Tanggal</th><th>Jam</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.user_name}</td><td>{b.room_name}</td><td>{b.date}</td><td>{b.start}–{b.end}</td>
                <td><StatusBadge status={b.status} /></td>
                <td className="actions">
                  {b.status === 'pending' && <>
                    <Button onClick={() => setStatus(b.id, 'approved')}>Setujui</Button>
                    <Button variant="danger" onClick={() => setStatus(b.id, 'rejected')}>Tolak</Button>
                  </>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="two-col">
        <Card>
          <h3>Tambah Ruangan</h3>
          <form onSubmit={addRoom}>
            <Input label="Nama ruangan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Gedung" value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} />
            <Input label="Kapasitas" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            <Button type="submit">Simpan</Button>
          </form>
        </Card>
        <Card>
          <h3>Daftar Ruangan</h3>
          <table>
            <thead><tr><th>Nama</th><th>Gedung</th><th>Kapasitas</th><th></th></tr></thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id}><td>{r.name}</td><td>{r.building}</td><td>{r.capacity}</td>
                  <td><Button variant="danger" onClick={async () => { await api.deleteRoom(r.id); load() }}>Hapus</Button></td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  )
}
