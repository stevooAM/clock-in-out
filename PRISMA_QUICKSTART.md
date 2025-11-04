# ⚡ Prisma Quick Start - Clock-In/Out System

> Get your database up and running with Prisma in 5 minutes!

## 🎯 What You Need

- PostgreSQL installed and running
- Node.js 20+
- This project cloned/downloaded

## 🚀 5-Minute Setup

### Step 1: Navigate to Server Directory
```bash
cd server
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs Prisma CLI and Prisma Client.

### Step 3: Create Database
```bash
# Option A: Command line
createdb clock_in_out

# Option B: Using psql
psql -U postgres
CREATE DATABASE clock_in_out;
\q
```

### Step 4: Configure Environment

The `.env.example` file is already set up. You can either:

**Option A - Use defaults:**
```bash
# If using postgres user with password "password"
# No action needed! Defaults will work
```

**Option B - Custom configuration:**
Create/edit `.env` file:
```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/clock_in_out?schema=public"
```

### Step 5: Generate Prisma Client
```bash
npm run prisma:generate
```

### Step 6: Create Database Tables
```bash
npm run prisma:migrate
```

When prompted for migration name, enter: `init`

### Step 7: Seed Database with Sample Data
```bash
npm run db:seed
```

### Step 8: Start the Server
```bash
npm run start:dev
```

## ✅ Verify It Works

### 1. Check Server is Running
Visit: http://localhost:3000/users

You should see JSON data with users!

### 2. Open Prisma Studio
```bash
npm run prisma:studio
```

Opens at: http://localhost:5555

You can view and edit all your data here!

### 3. Check User Endpoint
Visit: http://localhost:3000/user

Should return users without NFC keys (just Charlie Brown initially).

## 📊 What Was Created

### Database Tables:
1. **user** - 5 sample employees
2. **user_schedule** - Work schedules
3. **auth_entity** - Clock-in/out records

### Sample Data:
- **John Doe** (user001) - Full time, Room 101, Has NFC key
- **Jane Smith** (user002) - Full time, Room 102, Has NFC key
- **Bob Johnson** (user003) - Part time, Room 103, Has NFC key
- **Alice Williams** (user004) - Part time, Room 104, Has NFC key
- **Charlie Brown** (user005) - Full time, Room 105, **No NFC key yet**

## 🎨 Prisma Studio - Your Visual Database

```bash
npm run prisma:studio
```

Opens a beautiful web interface where you can:
- ✅ View all tables
- ✅ Add/edit/delete records
- ✅ Filter and search
- ✅ See relationships visually

## 🔧 Common Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# Open visual database editor
npm run prisma:studio

# Reset database (delete all data and re-migrate)
npm run prisma:migrate -- reset

# Seed database again
npm run db:seed

# Push schema without migration (development only)
npm run db:push
```

## 📁 Project Structure

```
server/
├── prisma/
│   ├── schema.prisma      ← Database structure
│   ├── seed.ts           ← Sample data
│   └── migrations/       ← Migration history
├── src/
│   ├── prisma/
│   │   ├── prisma.service.ts  ← Database connection
│   │   └── prisma.module.ts   ← Global module
│   └── modules/
│       ├── users/        ← User management
│       └── auth/         ← Clock-in/out
└── .env                  ← Database connection string
```

## 🐛 Troubleshooting

### Can't Connect to Database?
```bash
# Check PostgreSQL is running
# macOS:
brew services list
brew services start postgresql@14

# Linux:
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Database Doesn't Exist?
```bash
createdb clock_in_out
```

### Port 3000 Already in Use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Prisma Client Not Found?
```bash
npm run prisma:generate
```

### Migration Errors?
```bash
# Reset everything and start fresh
npm run prisma:migrate -- reset
npm run db:seed
```

## 🎯 Next Steps

### 1. Test the API

**Get all users:**
```bash
curl http://localhost:3000/users
```

**Clock in a user:**
```bash
curl -X POST http://localhost:3000/in \
  -H "Content-Type: application/json" \
  -d '{"key": "NFC-KEY-001"}'
```

**Clock out a user:**
```bash
curl -X POST http://localhost:3000/out \
  -H "Content-Type: application/json" \
  -d '{"key": "NFC-KEY-001"}'
```

### 2. Register NFC Card for Charlie

**Get users without keys:**
```bash
curl http://localhost:3000/user
```

**Register Charlie's card:**
```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{"uid": "user005", "key": "NFC-KEY-005"}'
```

### 3. Explore with Prisma Studio

```bash
npm run prisma:studio
```

- View all users
- See their schedules
- Check clock-in/out history
- Add new users directly

### 4. Customize the Data

Edit `prisma/seed.ts` to add your own:
- Employees
- Schedules
- Rooms
- Historical data

Then re-seed:
```bash
npm run db:seed
```

## 📚 Documentation

- **[PRISMA_SETUP.md](./PRISMA_SETUP.md)** - Detailed setup guide
- **[PRISMA_MIGRATION.md](./PRISMA_MIGRATION.md)** - Migration from TypeORM
- **[Prisma Docs](https://www.prisma.io/docs)** - Official documentation

## 🎉 You're All Set!

Your database is ready with:
- ✅ PostgreSQL connected
- ✅ Tables created
- ✅ Sample data loaded
- ✅ Prisma Client generated
- ✅ Server running

**API Available at:** http://localhost:3000
**Prisma Studio:** http://localhost:5555 (run `npm run prisma:studio`)

---

## 💡 Pro Tips

1. **Always generate after schema changes:**
   ```bash
   npm run prisma:generate
   ```

2. **Use Prisma Studio for quick data edits:**
   ```bash
   npm run prisma:studio
   ```

3. **Reset database when things go wrong:**
   ```bash
   npm run prisma:migrate -- reset && npm run db:seed
   ```

4. **Check your .env file first if connection fails**

5. **Prisma caches - restart server after big changes**

Happy coding! 🚀

