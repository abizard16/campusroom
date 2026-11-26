import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import './style.css'
import { AuthProvider, useAuth } from './auth.jsx'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Rooms from './pages/Rooms.jsx'
import BookRoom from './pages/BookRoom.jsx'
import MyBookings from './pages/MyBookings.jsx'
import Admin from './pages/Admin.jsx'

function Private({ children, admin }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (admin && user.role !== 'admin') return <Navigate to="/dashboard" />
  return <><Navbar /><main className="container">{children}</main></>
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
        <Route path="/rooms" element={<Private><Rooms /></Private>} />
        <Route path="/rooms/:id/book" element={<Private><BookRoom /></Private>} />
        <Route path="/my-bookings" element={<Private><MyBookings /></Private>} />
        <Route path="/admin" element={<Private admin><Admin /></Private>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)
