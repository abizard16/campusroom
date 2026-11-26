"""CampusRoom REST API (Flask).
Data disimpan sebagai JSON di memori (sesuai ketentuan Tugas 9: tanpa database).
Komunikasi front-end <-> back-end lewat HTTP (JSON).
"""
from datetime import datetime
from flask import Flask, jsonify, request, abort
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ---------- data awal (hardcoded JSON) ----------
users = [
    {"id": 1, "name": "Admin Sarpras", "email": "admin@campus.ac.id", "password": "admin123", "role": "admin"},
    {"id": 2, "name": "Abizard Arsalan", "email": "sae@student.ac.id", "password": "sae123", "role": "mahasiswa"},
    {"id": 3, "name": "HIMA Informatika", "email": "hima@student.ac.id", "password": "hima123", "role": "organisasi"},
]
rooms = [
    {"id": 1, "name": "Ruang Rapat A", "building": "Gedung Selaru", "capacity": 20, "facilities": ["Proyektor", "AC", "Whiteboard"]},
    {"id": 2, "name": "Lab Komputer 3", "building": "Gedung Kultubai", "capacity": 40, "facilities": ["PC", "Proyektor", "AC"]},
    {"id": 3, "name": "Aula Mini", "building": "Gedung Damar", "capacity": 80, "facilities": ["Sound System", "Proyektor"]},
    {"id": 4, "name": "Ruang Diskusi 2", "building": "Perpustakaan", "capacity": 8, "facilities": ["TV", "Whiteboard"]},
]
bookings = [
    {"id": 1, "user_id": 2, "room_id": 1, "date": "2026-12-01", "start": "09:00", "end": "11:00",
     "purpose": "Rapat kelompok Komputasi Awan", "status": "approved"},
    {"id": 2, "user_id": 3, "room_id": 3, "date": "2026-12-03", "start": "13:00", "end": "16:00",
     "purpose": "Seminar HIMA", "status": "pending"},
]


def next_id(items):
    return max((i["id"] for i in items), default=0) + 1


def find(items, item_id):
    item = next((i for i in items if i["id"] == item_id), None)
    if item is None:
        abort(404, description="Data tidak ditemukan")
    return item


def public_user(u):
    return {k: v for k, v in u.items() if k != "password"}


def is_conflict(room_id, date, start, end, ignore_id=None):
    for b in bookings:
        if b["id"] == ignore_id or b["room_id"] != room_id or b["date"] != date or b["status"] == "rejected":
            continue
        if start < b["end"] and end > b["start"]:
            return True
    return False


@app.errorhandler(404)
@app.errorhandler(400)
@app.errorhandler(409)
def handle_error(e):
    return jsonify({"error": e.description}), e.code


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "time": datetime.now().isoformat(timespec="seconds")})


# ---------- Auth ----------
@app.post("/api/auth/login")
def login():
    body = request.get_json(force=True)
    u = next((u for u in users if u["email"] == body.get("email") and u["password"] == body.get("password")), None)
    if not u:
        return jsonify({"error": "Email atau password salah"}), 401
    return jsonify(public_user(u))


# ---------- User CRUD ----------
@app.get("/api/users")
def list_users():
    return jsonify([public_user(u) for u in users])


@app.post("/api/users")
def create_user():
    body = request.get_json(force=True)
    if not all(body.get(k) for k in ("name", "email", "password")):
        abort(400, description="Nama, email, dan password wajib diisi")
    if any(u["email"] == body["email"] for u in users):
        abort(409, description="Email sudah terdaftar")
    u = {"id": next_id(users), "name": body["name"], "email": body["email"],
         "password": body["password"], "role": body.get("role", "mahasiswa")}
    users.append(u)
    return jsonify(public_user(u)), 201


@app.put("/api/users/<int:uid>")
def update_user(uid):
    u = find(users, uid)
    u.update({k: v for k, v in request.get_json(force=True).items() if k in ("name", "email", "password", "role")})
    return jsonify(public_user(u))


@app.delete("/api/users/<int:uid>")
def delete_user(uid):
    users.remove(find(users, uid))
    return "", 204


# ---------- Room CRUD ----------
@app.get("/api/rooms")
def list_rooms():
    q = request.args.get("q", "").lower()
    return jsonify([r for r in rooms if q in r["name"].lower() or q in r["building"].lower()])


@app.get("/api/rooms/<int:rid>")
def get_room(rid):
    return jsonify(find(rooms, rid))


@app.post("/api/rooms")
def create_room():
    body = request.get_json(force=True)
    if not body.get("name") or not body.get("capacity"):
        abort(400, description="Nama dan kapasitas wajib diisi")
    r = {"id": next_id(rooms), "name": body["name"], "building": body.get("building", ""),
         "capacity": int(body["capacity"]), "facilities": body.get("facilities", [])}
    rooms.append(r)
    return jsonify(r), 201


@app.put("/api/rooms/<int:rid>")
def update_room(rid):
    r = find(rooms, rid)
    r.update({k: v for k, v in request.get_json(force=True).items() if k in ("name", "building", "capacity", "facilities")})
    return jsonify(r)


@app.delete("/api/rooms/<int:rid>")
def delete_room(rid):
    rooms.remove(find(rooms, rid))
    return "", 204


# ---------- Booking CRUD ----------
@app.get("/api/bookings")
def list_bookings():
    uid = request.args.get("user_id", type=int)
    data = [b for b in bookings if uid is None or b["user_id"] == uid]
    out = []
    for b in data:
        room = next((r for r in rooms if r["id"] == b["room_id"]), {})
        user = next((u for u in users if u["id"] == b["user_id"]), {})
        out.append({**b, "room_name": room.get("name", "-"), "user_name": user.get("name", "-")})
    return jsonify(out)


@app.post("/api/bookings")
def create_booking():
    body = request.get_json(force=True)
    need = ("user_id", "room_id", "date", "start", "end")
    if not all(body.get(k) for k in need):
        abort(400, description="Data peminjaman belum lengkap")
    if body["start"] >= body["end"]:
        abort(400, description="Jam selesai harus setelah jam mulai")
    find(rooms, int(body["room_id"]))
    if is_conflict(int(body["room_id"]), body["date"], body["start"], body["end"]):
        abort(409, description="Ruangan sudah dipinjam di jam tersebut")
    b = {"id": next_id(bookings), "user_id": int(body["user_id"]), "room_id": int(body["room_id"]),
         "date": body["date"], "start": body["start"], "end": body["end"],
         "purpose": body.get("purpose", ""), "status": "pending"}
    bookings.append(b)
    return jsonify(b), 201


@app.put("/api/bookings/<int:bid>")
def update_booking(bid):
    b = find(bookings, bid)
    body = request.get_json(force=True)
    new = {**b, **{k: v for k, v in body.items() if k in ("room_id", "date", "start", "end", "purpose", "status")}}
    if any(k in body for k in ("room_id", "date", "start", "end")) and \
            is_conflict(int(new["room_id"]), new["date"], new["start"], new["end"], ignore_id=bid):
        abort(409, description="Ruangan sudah dipinjam di jam tersebut")
    b.update(new)
    return jsonify(b)


@app.delete("/api/bookings/<int:bid>")
def delete_booking(bid):
    bookings.remove(find(bookings, bid))
    return "", 204


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
