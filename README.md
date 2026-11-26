# CampusRoom

Aplikasi peminjaman ruangan kampus (Tugas Komputasi Awan dan Terdistribusi).

- **Front-end:** React.js (Vite) — `frontend/`
- **Back-end:** Python Flask REST API — `backend/`
- **Komunikasi:** HTTP + JSON (`fetch` ke `http://<host>:5000/api`)
- **Data:** JSON hardcoded di memori (belum pakai database)

## Menjalankan

```bash
# back-end
cd backend
pip install -r requirements.txt
python app.py            # http://localhost:5000

# front-end (terminal lain)
cd frontend
cp .env.example .env     # atur VITE_API_URL kalau back-end di EC2
npm install
npm run dev              # http://localhost:5173
```

Akun contoh: `admin@campus.ac.id / admin123`, `sae@student.ac.id / sae123`.

## Endpoint API

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | /api/health | Cek server |
| POST | /api/auth/login | Login |
| GET/POST | /api/users | List / register user |
| PUT/DELETE | /api/users/:id | Ubah / hapus user |
| GET/POST | /api/rooms | List (bisa `?q=`) / tambah ruangan |
| GET/PUT/DELETE | /api/rooms/:id | Detail / ubah / hapus ruangan |
| GET/POST | /api/bookings | List (bisa `?user_id=`) / ajukan peminjaman (cek bentrok jadwal) |
| PUT/DELETE | /api/bookings/:id | Ubah status (approve/reject) / batalkan |

## Script EC2

- `scripts/setup_ec2.sh` — install dependency dan jalankan back-end di EC2 Ubuntu
- `scripts/server_check.sh` — cek CPU, RAM, disk, dan status back-end, hasilnya dicatat ke log

## Progres

- [x] CRUD User, Room, Booking
- [x] Login & register
- [x] Cek bentrok jadwal
- [x] Approve/reject oleh admin
- [ ] Database (rencana minggu 12–13)
- [ ] Autentikasi token (JWT)
