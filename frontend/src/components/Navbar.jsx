import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  return (
    <header className="navbar">
      <div className="brand">Campus<span>Room</span></div>
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/rooms">Cari Ruangan</NavLink>
        <NavLink to="/my-bookings">Peminjaman Saya</NavLink>
        {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="nav-user">
        <span className="avatar">{user?.name?.[0]}</span>
        <span>{user?.name}</span>
        <button className="link" onClick={() => { logout(); nav('/login') }}>Keluar</button>
      </div>
    </header>
  )
}
