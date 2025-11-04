# 🚀 Deployment Guide - Clock-In/Out System

## Overview

This guide will help you deploy your Clock-In/Out system to production.

---

## 📋 Prerequisites

Before deploying, you need:

1. **GitHub account** (to push your code)
2. **Vercel account** (free tier works!) - https://vercel.com
3. **Neon/Railway account** for PostgreSQL database (free tier available)

---

## 🗄️ Step 1: Set Up Production Database

### Option A: Neon (Recommended - Free Tier)

1. Go to https://neon.tech
2. Sign up for free account
3. Create a new project: "clock-in-out-prod"
4. Copy the connection string (looks like):
   ```
   postgresql://username:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Option B: Railway (Alternative)

1. Go to https://railway.app
2. Sign up for free account
3. Click "New Project" → "Provision PostgreSQL"
4. Copy the connection string from the "Connect" tab

### Option C: Supabase

1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy the connection string

---

## 🔧 Step 2: Configure Backend for Deployment

### Update Backend Configuration

1. **Create production environment file**:

Create `server/.env.production`:
```env
DATABASE_URL="YOUR_PRODUCTION_DATABASE_URL_HERE"
PORT=3000
NODE_ENV=production
```

2. **Update package.json** (already configured with build scripts)

3. **Generate Prisma Client**:
```bash
cd server
npm run prisma:generate
```

---

## 🌐 Step 3: Deploy Backend

### Deploy to Vercel

```bash
cd server

# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**During deployment, set environment variables:**
- `DATABASE_URL` = Your production database connection string
- `NODE_ENV` = production

**Alternative: Deploy via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import from Git repository
4. Set Root Directory to `server`
5. Add environment variables
6. Click "Deploy"

**After deployment, you'll get a URL like:**
```
https://clock-in-out-backend-xyz.vercel.app
```

### Run Database Migration

```bash
# Set your production database URL
export DATABASE_URL="your_production_database_url"

# Run migrations
cd server
npx prisma migrate deploy

# Seed database (optional)
npm run db:seed
```

---

## 🎨 Step 4: Configure Frontend

### Update Production Environment

Edit `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  APIENDPOINT_BACKEND: 'https://your-backend-url.vercel.app'
};
```

Replace `your-backend-url.vercel.app` with your actual backend URL from Step 3.

---

## 🚀 Step 5: Deploy Frontend

### Build for Production

```bash
cd frontend

# Build
npm run build
```

### Deploy to Vercel

```bash
# Login (if not already)
vercel login

# Deploy
vercel --prod
```

**Alternative: Deploy via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import from Git repository
4. Set Root Directory to `frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist/frontend/browser`
7. Click "Deploy"

**After deployment, you'll get a URL like:**
```
https://clock-in-out.vercel.app
```

---

## ✅ Step 6: Verify Deployment

### Test Backend API

```bash
# Test users endpoint
curl https://your-backend-url.vercel.app/users

# Expected response:
# {"users":[],"timestamp":1234567890}
```

### Test Frontend

1. Open your frontend URL in browser
2. You should see the Clock-In/Out dashboard
3. Check that it loads data from the backend

### Test Complete Flow

1. Go to `/user` page
2. Register an NFC card for Charlie Brown (user005)
3. Go back to main page
4. Verify data loads correctly

---

## 🔒 Security & Best Practices

### Environment Variables

Never commit these files:
- `server/.env`
- `server/.env.production`

Use Vercel's environment variable settings instead.

### CORS Configuration

The backend is configured to allow all origins with `app.enableCors()`.

For production, update `server/src/main.ts`:

```typescript
app.enableCors({
  origin: ['https://your-frontend-url.vercel.app'],
  credentials: true,
});
```

### Database Connection

- Use connection pooling for production
- Enable SSL mode for database connections
- Keep connection strings in environment variables only

---

## 🎯 Quick Deployment Commands

### Backend
```bash
cd server
vercel --prod
# Add DATABASE_URL in Vercel dashboard
# Run: npx prisma migrate deploy (with DATABASE_URL set)
```

### Frontend
```bash
cd frontend
# Update environment.prod.ts with backend URL
npm run build
vercel --prod
```

---

## 📊 Monitoring

### Vercel Dashboard

- View deployment logs
- Monitor function executions
- Check error rates
- View analytics

### Database Monitoring

- **Neon**: Check dashboard for connection pool usage
- **Railway**: Monitor CPU/Memory usage
- **Supabase**: View query performance

---

## 🐛 Troubleshooting

### Backend Issues

**"Cannot connect to database"**
- Check DATABASE_URL is correct
- Verify SSL mode is enabled
- Check database is accessible from Vercel

**"Function timeout"**
- Vercel has 10s timeout for free tier
- Optimize database queries
- Consider upgrading plan

### Frontend Issues

**"API calls failing"**
- Check CORS configuration
- Verify backend URL in environment.prod.ts
- Check network tab in browser DevTools

**"Build fails"**
- Run `npm run build` locally first
- Check for TypeScript errors
- Verify all dependencies are in package.json

---

## 💰 Cost Estimate

### Free Tier (Sufficient for testing)

- **Vercel**: Free (Hobby plan)
  - 100 GB bandwidth/month
  - Unlimited deployments
  
- **Neon**: Free
  - 0.5 GB storage
  - 1 project
  - Compute auto-suspends after 5 min inactivity

- **Railway**: $5 credit/month (free trial)
  - Then pay for usage

**Total: FREE for small usage!**

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

1. Connect your Git repository to Vercel
2. Vercel will auto-deploy on push to main branch
3. Preview deployments for pull requests

### Setup:
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Connect repository
4. Configure build settings
5. Done! Deploys automatically

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Angular Production Build](https://angular.io/guide/deployment)
- [NestJS Deployment](https://docs.nestjs.com/faq/serverless)

---

## ✨ Your App is Live!

After following these steps, your Clock-In/Out system will be:

- ✅ Accessible from anywhere
- ✅ Using production database
- ✅ Auto-scaling with Vercel
- ✅ HTTPS enabled by default
- ✅ Global CDN for fast access

**Share your app URL with your team!** 🎉

