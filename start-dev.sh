#!/bin/bash
# Script to start both frontend and backend

echo "Starting Spring Boot backend..."
cd "$(dirname "$0")"
mvn spring-boot:run > server.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

echo "Waiting for backend to start..."
sleep 5

echo "Starting Vite frontend..."
cd frontend
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

echo ""
echo "✓ Backend: http://localhost:8080"
echo "✓ Frontend: http://localhost:3000"
echo ""
echo "Logs:"
echo "  Backend: tail -f server.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "To stop: ./kill-dev.sh"
