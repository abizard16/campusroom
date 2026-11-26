// Reusable elements: Button, Card, SearchBar, StatusBadge, Input, StatCard
export function Button({ variant = 'primary', children, ...props }) {
  return <button className={`btn btn-${variant}`} {...props}>{children}</button>
}

export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>
}

export function SearchBar({ value, onChange, placeholder = 'Cari ruangan atau gedung...' }) {
  return (
    <div className="search">
      <span className="search-icon">⌕</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

const LABEL = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' }
export function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{LABEL[status] || status}</span>
}

export function Input({ label, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      {props.type === 'select' ? (
        <select {...props}>{props.children}</select>
      ) : props.type === 'textarea' ? (
        <textarea {...props} />
      ) : (
        <input {...props} />
      )}
    </label>
  )
}

export function StatCard({ label, value, accent }) {
  return (
    <Card className="stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value" style={{ color: accent }}>{value}</span>
    </Card>
  )
}

export function RoomCard({ room, onBook }) {
  return (
    <Card className="room-card">
      <div className="room-thumb">{room.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</div>
      <div className="room-body">
        <h3>{room.name}</h3>
        <p className="muted">{room.building} · Kapasitas {room.capacity} orang</p>
        <div className="chips">{room.facilities.map((f) => <span key={f} className="chip">{f}</span>)}</div>
        <Button onClick={() => onBook(room)}>Pinjam Ruangan</Button>
      </div>
    </Card>
  )
}
