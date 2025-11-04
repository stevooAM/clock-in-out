#!/bin/bash

# Clock-in/Out System - Quick Setup Script
# This script will help you set up both frontend and backend

set -e

echo "🚀 Clock-in/Out System - Modernized Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node version
echo "📋 Checking prerequisites..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ is required. Current version: $(node -v)${NC}"
    echo "Please install Node.js 20 LTS from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if PostgreSQL is installed
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL is installed${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL not found. Please install PostgreSQL 12+ for the backend to work.${NC}"
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Frontend setup
echo "🎨 Setting up Frontend (Angular 17)..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules already exists. Run 'npm install' manually if needed.${NC}"
fi
cd ..

echo ""

# Backend setup
echo "⚙️  Setting up Backend (NestJS 10)..."
cd server
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules already exists. Run 'npm install' manually if needed.${NC}"
fi
cd ..

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Setup completed!${NC}"
echo ""
echo "📚 Next steps:"
echo ""
echo "1. Configure your database connection in server/env/default.ts"
echo "2. Start the backend:"
echo "   cd server && npm run start:dev"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd frontend && npm start"
echo ""
echo "4. Open http://localhost:4200 in your browser"
echo ""
echo "📖 For more information, see:"
echo "   - MODERNIZATION.md - Details about the upgrade"
echo "   - README.md - Original project documentation"
echo ""
echo "🎉 Happy coding!"

