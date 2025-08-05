#!/bin/bash

echo "🚀 Starting GameFi Multi-Chain DeFAI Platform..."

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check if required ports are available
check_port 3000
FRONTEND_PORT_CHECK=$?

check_port 3001
BACKEND_PORT_CHECK=$?

if [ $FRONTEND_PORT_CHECK -ne 0 ] || [ $BACKEND_PORT_CHECK -ne 0 ]; then
    echo "❌ Required ports are in use. Please stop other services first."
    exit 1
fi

# Create logs directory
mkdir -p logs

# Start backend
echo "🔧 Starting backend server..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ GameFi Platform is starting up..."
echo "📊 Backend: http://localhost:3001"
echo "🎮 Frontend: http://localhost:3000"
echo "🏥 Health Check: http://localhost:3001/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping GameFi Platform..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
