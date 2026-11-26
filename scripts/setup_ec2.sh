#!/bin/bash
# setup_ec2.sh - install dependency dan jalankan back-end CampusRoom di EC2 (Ubuntu)
# Cara pakai: chmod +x setup_ec2.sh && ./setup_ec2.sh <url-repo-github>
set -e
REPO_URL=${1:?"Masukkan URL repo GitHub, contoh: ./setup_ec2.sh https://github.com/user/campusroom.git"}

sudo apt update -y
sudo apt install -y python3 python3-venv git curl

[ -d campusroom ] || git clone "$REPO_URL" campusroom
cd campusroom/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

nohup python3 app.py > ~/backend.log 2>&1 &
sleep 3
curl -s http://localhost:5000/api/health && echo -e "\nBack-end jalan di port 5000"
