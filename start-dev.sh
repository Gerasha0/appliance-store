#!/bin/bash
# Script to run the Spring Boot application with environment variables
# Usage: ./start-dev.sh

# Check if .env file exists
if [ -f .env ]; then
    echo "Loading environment variables from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Warning: .env file not found. Using default values from application.properties"
    echo "Please copy .env.example to .env and set your actual values:"
    echo "  cp .env.example .env"
    echo ""
fi

# Verify required environment variables
if [ -z "$JWT_SECRET" ]; then
    echo "ERROR: JWT_SECRET is not set!"
    echo "Please set it in .env file or export it:"
    echo "  export JWT_SECRET='your_secret_key'"
    exit 1
fi

if [ -z "$DB_PASSWORD" ]; then
    echo "WARNING: DB_PASSWORD is not set. Using empty password (not recommended for production)"
fi

# Display configuration (without showing secrets)
echo "========================================"
echo "Starting Appliance Store Application"
echo "========================================"
echo "Database User: ${DB_USER:-appliance_user}"
echo "Database Password: ${DB_PASSWORD:+***set***}"
echo "JWT Secret: ${JWT_SECRET:+***set***}"
echo "JWT Expiration: ${JWT_EXPIRATION:-86400000}ms"
echo "========================================"
echo ""

# Run the application
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

