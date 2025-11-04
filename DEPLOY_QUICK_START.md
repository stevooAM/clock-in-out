# 🚀 Quick Deployment Guide

## Option 1: Automated Deployment (Recommended)

Run the deployment script:

```bash
./deploy.sh
```

Follow the prompts and the script will guide you through the entire process!

---

## Option 2: Manual Deployment

### 📋 Prerequisites

1. **Install Vercel CLI** (if not installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

---

### 🗄️ Step 1: Set Up Production Database (5 minutes)

Choose one of these free options:

#### Option A: Neon (Recommended - Free Forever)

1. Go to https://neon.tech
2. Sign up with GitHub/email
3. Click "Create Project"
4. Project name: `clock-in-out-prod`
5. Copy the connection string:
   ```
   postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

#### Option B: Railway ($5 free credit)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Provision PostgreSQL"
4. Click "PostgreSQL" → "Connect" → Copy connection string

#### Option C: Supabase (Free tier)

1. Go to https://supabase.com
2. Create new project
3. Settings → Database → Connection String → Copy

---

### 🔧 Step 2: Deploy Backend (3 minutes)

```bash
cd server

# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

**During deployment:**
- Accept defaults for most prompts
- When asked about environment variables, add:
  - `DATABASE_URL` = your database connection string from Step 1

**After deployment:**
- You'll get a URL like: `https://clock-in-out-backend-xyz.vercel.app`
- **COPY THIS URL** - you'll need it for the frontend!

**Run database migrations:**
```bash
# Set your DATABASE_URL
export DATABASE_URL="your_connection_string_here"

# Run migrations
npx prisma migrate deploy

# Seed the database (optional)
npm run db:seed
```

---

### 🎨 Step 3: Deploy Frontend (3 minutes)

```bash
cd ../frontend

# Update the production environment file
# Edit: src/environments/environment.prod.ts
# Replace: YOUR_BACKEND_URL_HERE.vercel.app
# With: your actual backend URL from Step 2
```

Edit `frontend/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  APIENDPOINT_BACKEND: "https://clock-in-out-backend-xyz.vercel.app"  // Your backend URL
};
```

```bash
# Build the frontend
npm run build

# Deploy to Vercel
vercel --prod
```

**After deployment:**
- You'll get a URL like: `https://clock-in-out.vercel.app`
- **This is your live app!** 🎉

---

## ✅ Verification

Test your deployed app:

```bash
# Test backend
curl https://your-backend-url.vercel.app/users

# Expected response:
# {"users":[...],"timestamp":1234567890}
```

Open your frontend URL in a browser:
- You should see the Clock-In/Out dashboard
- Data should load from your production database

---

## 🔐 Environment Variables (Vercel Dashboard)

If you need to add/update environment variables:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add: `DATABASE_URL` = your connection string
5. Redeploy if needed

---

## 📊 Useful Commands

```bash
# View deployments
vercel ls

# View logs
vercel logs

# Access production shell
vercel env pull

# Rollback deployment
vercel rollback
```

---

## 🎯 Quick Reference

| Service | Purpose | Cost |
|---------|---------|------|
| **Vercel** | Host frontend & backend | Free (Hobby) |
| **Neon** | PostgreSQL database | Free |
| **Railway** | Alternative database | $5 free credit |

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL is correct in Vercel dashboard
- Verify SSL mode is enabled: `?sslmode=require`
- Check database is accessible (firewall rules)

### "API calls failing (CORS)"
- Update CORS in `server/src/main.ts`:
```typescript
app.enableCors({
  origin: ['https://your-frontend-url.vercel.app'],
  credentials: true,
});
```

### "Build failed"
- Run `npm run build` locally first
- Check for TypeScript errors
- Verify all dependencies in package.json

---

## 🎉 That's It!

Your Clock-In/Out system is now live and accessible from anywhere!

**Total deployment time: ~15 minutes**

Share your app URL with your team! 🚀

