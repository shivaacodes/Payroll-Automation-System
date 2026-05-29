#!/bin/bash
set -e

echo "Starting Payroll Automation System via Docker Compose..."
docker compose up --build -d

echo ""
echo "=========================================================="
echo "System is starting in the background."
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8080"
echo "=========================================================="
echo ""
echo "To view live logs, run: docker compose logs -f"
echo "To stop the system, run: docker compose down"
echo ""
