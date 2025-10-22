#!/bin/bash

# KopiTalk FastAPI Server Startup Script
# This script sets up the virtual environment and starts the server

set -e  # Exit on any error

echo "🚀 Starting KopiTalk FastAPI Server..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "📁 Project root: $PROJECT_ROOT"

# Navigate to project root
cd "$PROJECT_ROOT"

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "🔧 Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source .venv/bin/activate

# Navigate to server directory
cd server

# Install/update dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Creating template .env file..."
    cat > .env << EOL
# Replace with your actual Google API key
GOOGLE_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.5-flash
EOL
    echo "🔑 Please edit server/.env and add your actual GOOGLE_API_KEY"
    echo "📖 You can get an API key from: https://aistudio.google.com/app/apikey"
fi

# Start the server
echo "🎮 Starting FastAPI server on http://localhost:8000"
echo "🔧 Admin panel available at: http://localhost:8000/admin"
echo "📊 API docs available at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"

python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
