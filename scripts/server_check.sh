#!/bin/bash
# server_check.sh - script sederhana untuk cek kondisi EC2 dan back-end CampusRoom
# Cara pakai: chmod +x server_check.sh && ./server_check.sh

LOG_FILE="$HOME/server_check.log"
API_URL="http://localhost:5000/api/health"

echo "===== CampusRoom Server Check ====="
echo "Waktu      : $(date '+%Y-%m-%d %H:%M:%S')"
echo "Hostname   : $(hostname)"
echo "OS         : $(grep PRETTY_NAME /etc/os-release | cut -d '"' -f2)"
echo "Uptime     : $(uptime -p)"
echo "CPU core   : $(nproc)"
echo "RAM        : $(free -h | awk '/Mem:/ {print $3 " terpakai dari " $2}')"
echo "Disk (/)   : $(df -h / | awk 'NR==2 {print $3 " terpakai dari " $2 " (" $5 ")"}')"

# peringatan kalau disk hampir penuh
DISK_USED=$(df / | awk 'NR==2 {gsub("%",""); print $5}')
if [ "$DISK_USED" -ge 80 ]; then
  echo "PERINGATAN : disk sudah ${DISK_USED}%"
fi

# cek apakah back-end Flask jalan
if curl -s --max-time 3 "$API_URL" > /dev/null; then
  STATUS="UP"
else
  STATUS="DOWN"
fi
echo "Back-end   : $STATUS"

echo "$(date '+%Y-%m-%d %H:%M:%S') disk=${DISK_USED}% backend=$STATUS" >> "$LOG_FILE"
echo "Log disimpan di $LOG_FILE"
