import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { RoomCard, SearchBar } from '../components/ui.jsx'

export default function Rooms() {
  const [q, setQ] = useState('')
  const [rooms, setRooms] = useState([])
  const nav = useNavigate()
  useEffect(() => { api.rooms(q).then(setRooms) }, [q])

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Cari Ruangan</h1>
          <p className="muted">{rooms.length} ruangan tersedia</p>
        </div>
      </div>
      <SearchBar value={q} onChange={setQ} />
      <div className="grid">
        {rooms.map((r) => <RoomCard key={r.id} room={r} onBook={() => nav(`/rooms/${r.id}/book`)} />)}
      </div>
    </>
  )
}
