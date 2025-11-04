#!/bin/bash

# 🚀 Clock-In/Out Deployment Script
# This script helps you deploy your app to production

set -e  # Exit on error

echo "🚀 Clock-In/Out Deployment Helper"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
else
    echo -e "${GREEN}✅ Vercel CLI found${NC}"
fi

echo ""
echo -e "${BLUE}📋 Deployment Steps:${NC}"
echo ""
echo "1️⃣  Set up production database (Neon/Railway/Supabase)"
echo "2️⃣  Deploy backend to Vercel"
echo "3️⃣  Update frontend environment with backend URL"
echo "4️⃣  Deploy frontend to Vercel"
echo ""

# Ask user what they want to deploy
echo -e "${YELLOW}What would you like to deploy?${NC}"
echo "1) Backend only"
echo "2) Frontend only"
echo "3) Both (recommended for first deployment)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}🔧 Deploying Backend...${NC}"
        echo ""
        
        # Check for DATABASE_URL
        if [ -z "$DATABASE_URL" ]; then
            echo -e "${YELLOW}⚠️  DATABASE_URL not set in environment${NC}"
            echo ""
            echo "Please set up your production database first:"
            echo "1. Go to https://neon.tech (recommended) or https://railway.app"
            echo "2. Create a new PostgreSQL database"
            echo "3. Copy the connection string"
            echo ""
            read -p "Paste your DATABASE_URL here: " db_url
            export DATABASE_URL="$db_url"
        fi
        
        cd server
        
        # Build
        echo "📦 Building backend..."
        npm run build
        
        # Deploy to Vercel
        echo ""
        echo "🚀 Deploying to Vercel..."
        echo "When prompted, add environment variable: DATABASE_URL"
        vercel --prod
        
        echo ""
        echo -e "${GREEN}✅ Backend deployed!${NC}"
        echo ""
        echo "Copy the deployment URL and update it in:"
        echo "frontend/src/environments/environment.prod.ts"
        ;;
        
    2)
        echo ""
        echo -e "${BLUE}🎨 Deploying Frontend...${NC}"
        echo ""
        
        cd frontend
        
        # Check if environment.prod.ts is updated
        if grep -q "YOUR_BACKEND_URL_HERE" src/environments/environment.prod.ts; then
            echo -e "${RED}❌ Error: Please update the backend URL first!${NC}"
            echo ""
            echo "Edit: frontend/src/environments/environment.prod.ts"
            echo "Replace: YOUR_BACKEND_URL_HERE.vercel.app"
            echo "With your actual backend URL"
            exit 1
        fi
        
        # Build
        echo "📦 Building frontend..."
        npm run build
        
        # Deploy to Vercel
        echo ""
        echo "🚀 Deploying to Vercel..."
        vercel --prod
        
        echo ""
        echo -e "${GREEN}✅ Frontend deployed!${NC}"
        ;;
        
    3)
        echo ""
        echo -e "${BLUE}🔧 Step 1: Deploying Backend...${NC}"
        echo ""
        
        # Check for DATABASE_URL
        echo "First, we need your production database connection string."
        echo ""
        echo "📚 Quick setup options:"
        echo "  • Neon.tech (recommended): https://neon.tech"
        echo "  • Railway: https://railway.app"
        echo "  • Supabase: https://supabase.com"
        echo ""
        read -p "Paste your DATABASE_URL here: " db_url
        
        if [ -z "$db_url" ]; then
            echo -e "${RED}❌ DATABASE_URL is required${NC}"
            exit 1
        fi
        
        export DATABASE_URL="$db_url"
        
        # Deploy Backend
        cd server
        echo ""
        echo "📦 Building backend..."
        npm run build
        
        echo ""
        echo "🚀 Deploying backend to Vercel..."
        echo ""
        echo -e "${YELLOW}⚠️  IMPORTANT: When Vercel prompts for environment variables:${NC}"
        echo "Add: DATABASE_URL = $db_url"
        echo ""
        read -p "Press Enter to continue with deployment..."
        
        vercel --prod
        
        echo ""
        echo -e "${GREEN}✅ Backend deployed!${NC}"
        echo ""
        echo "📋 Next, copy your backend URL (looks like: https://xyz.vercel.app)"
        read -p "Paste your backend URL here: " backend_url
        
        # Update frontend environment
        cd ../frontend
        sed -i.bak "s|https://YOUR_BACKEND_URL_HERE.vercel.app|$backend_url|g" src/environments/environment.prod.ts
        
        echo ""
        echo -e "${BLUE}🎨 Step 2: Deploying Frontend...${NC}"
        echo ""
        echo "📦 Building frontend..."
        npm run build
        
        echo ""
        echo "🚀 Deploying frontend to Vercel..."
        vercel --prod
        
        echo ""
        echo -e "${GREEN}✅ Frontend deployed!${NC}"
        echo ""
        echo -e "${GREEN}🎉 Deployment Complete!${NC}"
        echo ""
        echo "Your app is now live!"
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Done!${NC}"
echo ""
echo "📚 Useful commands:"
echo "  • View deployments: vercel ls"
echo "  • View logs: vercel logs"
echo "  • Run migrations: npm run prisma:migrate:deploy (with DATABASE_URL set)"
echo ""

