#!/bin/bash
# Script to properly kill development servers

echo "Stopping frontend (Vite)..."
pkill -f "vite" || echo "No Vite process found"

echo "Stopping npm dev processes..."
pkill -f "npm.*dev" || echo "No npm dev process found"

echo "Stopping Spring Boot..."
pkill -f "spring-boot:run" || echo "No Spring Boot process found"

# Wait a bit for graceful shutdown
sleep 2

# Check if ports are free
echo ""
echo "Checking ports..."
lsof -ti:3000 && echo "⚠️  Port 3000 still in use" || echo "✓ Port 3000 is free"
lsof -ti:8080 && echo "⚠️  Port 8080 still in use" || echo "✓ Port 8080 is free"

echo ""
echo "Done!"
