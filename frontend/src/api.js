// Semua komunikasi ke back-end lewat HTTP (fetch + JSON)
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan')
  return data
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (user) => request('/users', { method: 'POST', body: user }),
  rooms: (q = '') => request('/rooms?q=' + encodeURIComponent(q)),
  room: (id) => request('/rooms/' + id),
  createRoom: (room) => request('/rooms', { method: 'POST', body: room }),
  deleteRoom: (id) => request('/rooms/' + id, { method: 'DELETE' }),
  bookings: (userId) => request('/bookings' + (userId ? '?user_id=' + userId : '')),
  createBooking: (b) => request('/bookings', { method: 'POST', body: b }),
  updateBooking: (id, b) => request('/bookings/' + id, { method: 'PUT', body: b }),
  deleteBooking: (id) => request('/bookings/' + id, { method: 'DELETE' }),
}
