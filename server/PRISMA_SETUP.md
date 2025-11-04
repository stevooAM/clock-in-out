# 🗄️ Prisma Database Setup Guide

This guide will help you set up PostgreSQL with Prisma ORM for the Clock-In/Out backend.

## 📋 Prerequisites

- PostgreSQL 12+ installed and running
- Node.js 20+ installed
- npm or yarn package manager

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

This will install both Prisma CLI (`prisma`) and Prisma Client (`@prisma/client`).

### 2. Configure Database Connection

Create a `.env` file in the `server/` directory:

```bash
cp .env.example .env
```

Edit `.env` and update your database connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/clock_in_out?schema=public"
```

**Example configurations:**

```env
# Local PostgreSQL with default settings
DATABASE_URL="postgresql://postgres:password@localhost:5432/clock_in_out?schema=public"

# Local PostgreSQL on different port
DATABASE_URL="postgresql://postgres:password@localhost:5433/clock_in_out?schema=public"

# Remote PostgreSQL
DATABASE_URL="postgresql://user:pass@db.example.com:5432/clock_in_out?schema=public"
```

### 3. Create Database

```bash
# Using psql command line
createdb clock_in_out

# Or with psql
psql -U postgres
CREATE DATABASE clock_in_out;
\q
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

This generates the type-safe Prisma Client based on your schema.

### 5. Run Migration

```bash
npm run prisma:migrate
```

You'll be prompted to name your migration. Enter something like `init` or `initial_setup`.

This creates the tables in your database.

### 6. Seed Database

```bash
npm run db:seed
```

This populates your database with sample data:
- 5 users
- Schedules for each user
- Sample clock-in/out records

## 📊 Prisma Commands Reference

### Generate Prisma Client
```bash
npm run prisma:generate
```
- Generates TypeScript types and Prisma Client
- Run after any schema changes

### Create Migration
```bash
npm run prisma:migrate
```
- Creates a new migration file
- Applies it to your database
- Updates Prisma Client

### Deploy Migrations (Production)
```bash
npm run prisma:migrate:deploy
```
- Applies pending migrations
- Doesn't create new migration files
- Use in production/CI

### Push Schema to Database (Development)
```bash
npm run db:push
```
- Pushes schema changes without creating migrations
- Useful for rapid prototyping
- **Warning:** Can cause data loss

### Open Prisma Studio
```bash
npm run prisma:studio
```
- Opens visual database editor in browser
- View and edit data
- Accessible at http://localhost:5555

### Seed Database
```bash
npm run db:seed
```
- Runs the seed script
- Populates database with test data

## 🗂️ Database Schema

### User Table
```prisma
model User {
  uid      String   @id
  name     String
  key      String?  // NFC card key
  auths    Auth[]
  schedule UserSchedule[]
}
```

### UserSchedule Table
```prisma
model UserSchedule {
  id     Int    @id @default(autoincrement())
  day    String
  hour   String
  room   String
  userId String
  user   User   @relation(fields: [userId], references: [uid])
}
```

### Auth Table (Clock-in/out records)
```prisma
model Auth {
  id        Int    @id @default(autoincrement())
  reader    String // 'input' or 'output'
  timestamp Int    // Unix timestamp
  userId    String
  user      User   @relation(fields: [userId], references: [uid])
}
```

## 🔧 Common Tasks

### Reset Database
```bash
# Drop all tables and re-run migrations
npm run prisma:migrate -- reset

# Then seed
npm run db:seed
```

### View Database
```bash
# Open Prisma Studio
npm run prisma:studio

# Or use psql
psql -U postgres -d clock_in_out
\dt  # List tables
SELECT * FROM "user";  # Query users
```

### Update Schema

1. Edit `prisma/schema.prisma`
2. Generate client: `npm run prisma:generate`
3. Create migration: `npm run prisma:migrate`
4. Update your code to use new fields

### Create New Migration

```bash
# Make changes to schema.prisma first, then:
npm run prisma:migrate

# Name your migration descriptively:
# - add_email_field
# - create_department_table
# - update_user_constraints
```

## 🐛 Troubleshooting

### "Connection refused" Error

**Problem:** Can't connect to PostgreSQL

**Solutions:**
```bash
# Check if PostgreSQL is running
# macOS
brew services list
brew services start postgresql

# Linux
sudo systemctl status postgresql
sudo systemctl start postgresql

# Windows
# Check Services app for PostgreSQL service
```

### "Database doesn't exist" Error

**Problem:** Database not created

**Solution:**
```bash
createdb clock_in_out

# Or
psql -U postgres
CREATE DATABASE clock_in_out;
```

### "Schema not found" Error

**Problem:** Prisma Client not generated

**Solution:**
```bash
npm run prisma:generate
```

### Migration Conflicts

**Problem:** Migration files out of sync

**Solution:**
```bash
# Development: Reset and start fresh
npm run prisma:migrate -- reset
npm run db:seed

# Production: Carefully resolve conflicts manually
```

### Port Already in Use

**Problem:** PostgreSQL on different port

**Solution:**
Update DATABASE_URL in `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/clock_in_out?schema=public"
#                                                         ^^^^
```

## 📝 Migration vs Push vs Seed

### Use `prisma migrate dev` when:
- Making schema changes in development
- You want to track changes with migration files
- Preparing for production deployment

### Use `prisma db push` when:
- Rapid prototyping
- Schema changes are experimental
- You don't need migration history

### Use `db:seed` when:
- You need test data
- Setting up development environment
- Resetting to known state

## 🌍 Environment Variables

Required variables in `.env`:

```env
# Database connection (Required)
DATABASE_URL="postgresql://user:pass@host:port/database"

# Alternative format (if not using DATABASE_URL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=clock_in_out

# Server config
PORT=3000
NODE_ENV=development
```

## 🔐 Production Setup

### 1. Use Environment Variables

```bash
# Never commit .env files
# Use your hosting provider's environment variables

# Example for Heroku
heroku config:set DATABASE_URL="postgresql://..."

# Example for Vercel
# Add in dashboard or vercel.json
```

### 2. Run Migrations

```bash
npm run prisma:migrate:deploy
```

### 3. Generate Client

```bash
npm run prisma:generate
```

### 4. Build Application

```bash
npm run build
npm run start:prod
```

## 📚 Learn More

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma with NestJS](https://docs.nestjs.com/recipes/prisma)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] PostgreSQL is running
- [ ] Database `clock_in_out` exists
- [ ] `.env` file configured with correct DATABASE_URL
- [ ] Prisma Client generated (`node_modules/.prisma/client` exists)
- [ ] Migrations applied (tables exist in database)
- [ ] Sample data loaded (check with Prisma Studio)
- [ ] Backend starts without errors (`npm run start:dev`)
- [ ] Can query users at http://localhost:3000/users

## 🎉 You're Ready!

Your database is now set up with Prisma. Start the development server:

```bash
npm run start:dev
```

The API will be available at http://localhost:3000

