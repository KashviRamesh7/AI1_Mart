#!/bin/bash
echo ""
echo "============================================"
echo "  AI1 MART - All In One Mart"
echo "  Starting all services..."
echo "============================================"
echo ""

# Start MongoDB if not running
if ! pgrep -x "mongod" > /dev/null; then
  echo "[1/3] Starting MongoDB..."
  sudo systemctl start mongod 2>/dev/null || mongod --fork --logpath /tmp/mongod.log 2>/dev/null
  sleep 2
else
  echo "[1/3] MongoDB already running ✅"
fi

echo "[2/3] Starting Backend..."
cd "$(dirname "$0")/backend"
npm install --silent
npm run dev &
BACKEND_PID=$!
sleep 4

echo "[3/3] Starting Frontend..."
cd "$(dirname "$0")/frontend"
npm install --silent
npm start &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo "  Backend  → http://localhost:5000"
echo "  Frontend → http://localhost:3000"
echo "============================================"
echo ""
echo "First time? Open a new terminal and run:"
echo "  node seed.js"
echo ""
echo "Press Ctrl+C to stop all servers"
wait $BACKEND_PID $FRONTEND_PID
