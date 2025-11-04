# 🚀 Clock-In/Out Backend - NestJS 10 + Prisma

Modern backend for the Clock-In/Out attendance tracking system.

## ✨ Features

- 🎯 **NestJS 10** - Latest enterprise Node.js framework
- 🗄️ **Prisma ORM** - Type-safe database access
- 🐘 **PostgreSQL** - Reliable relational database
- 🔐 **Type Safety** - Full TypeScript coverage
- 📊 **Prisma Studio** - Visual database management
- ⚡ **Hot Reload** - Fast development workflow

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 12+
- npm or yarn

### Setup in 3 Steps

```bash
# 1. Install dependencies
npm install

# 2. Setup database (creates tables & adds sample data)
createdb clock_in_out
npm run prisma:migrate
npm run db:seed

# 3. Start development server
npm run start:dev
```

**API runs at:** http://localhost:3000

📖 **Need detailed setup?** See [PRISMA_QUICKSTART.md](./PRISMA_QUICKSTART.md)

## 📦 What's Inside

### Technology Stack
- **Framework:** NestJS 10
- **ORM:** Prisma 5.10
- **Database:** PostgreSQL
- **Language:** TypeScript 5.4
- **Runtime:** Node.js 20

### Project Structure
```
server/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts            # Sample data
│   └── migrations/        # Migration history
├── src/
│   ├── prisma/            # Prisma service
│   ├── modules/
│   │   ├── users/         # User management
│   │   └── auth/          # Clock in/out
│   ├── app.module.ts      # Root module
│   └── main.ts           # Entry point
└── test/                  # Tests
```

## 🎯 API Endpoints

### Get All Users
```bash
GET /users
# Returns all users with schedules and clock-in/out status
```

### Get Users Without NFC Keys
```bash
GET /user
# Returns users who need NFC card registration
```

### Register NFC Card
```bash
POST /user
Content-Type: application/json

{
  "uid": "user001",
  "key": "NFC-KEY-001"
}
```

### Clock In
```bash
POST /in
Content-Type: application/json

{
  "key": "NFC-KEY-001"
}
```

### Clock Out
```bash
POST /out
Content-Type: application/json

{
  "key": "NFC-KEY-001"
}
```

## 🗄️ Database (Prisma)

### Common Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Open visual database editor
npm run prisma:studio

# Seed database
npm run db:seed

# Reset database
npm run prisma:migrate -- reset
```

### Database Schema

- **User** - Employees with NFC keys
- **UserSchedule** - Work schedules
- **Auth** - Clock-in/out records

📖 **Full database guide:** [PRISMA_SETUP.md](./PRISMA_SETUP.md)

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run start:dev

# Start with debugging
npm run start:debug

# Build for production
npm run build

# Run production build
npm run start:prod

# Run tests
npm test

# Run tests with coverage
npm run test:cov

# Lint code
npm run lint

# Format code
npm run format
```

## 🐛 Troubleshooting

### Can't connect to database?
```bash
# Check PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Start PostgreSQL
brew services start postgresql@14  # macOS
sudo systemctl start postgresql  # Linux
```

### Database doesn't exist?
```bash
createdb clock_in_out
```

### Prisma Client errors?
```bash
npm run prisma:generate
```

### Port 3000 in use?
```bash
lsof -ti:3000 | xargs kill -9
```

## 📚 Documentation

- **[PRISMA_QUICKSTART.md](./PRISMA_QUICKSTART.md)** - 5-minute setup guide
- **[PRISMA_SETUP.md](./PRISMA_SETUP.md)** - Comprehensive database guide
- **[PRISMA_MIGRATION.md](./PRISMA_MIGRATION.md)** - TypeORM to Prisma migration details

## 🔄 Recent Updates

### v2.0.0 - Prisma Migration
- ✅ Migrated from TypeORM to Prisma ORM
- ✅ Updated to NestJS 10
- ✅ Replaced moment.js with date-fns
- ✅ Added Prisma Studio support
- ✅ Improved type safety
- ✅ Better developer experience

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🚀 Deployment

### Using Docker
```bash
docker build -t clock-backend .
docker run -p 3000:3000 clock-backend
```

### Environment Variables
```env
DATABASE_URL="postgresql://user:pass@host:port/db"
PORT=3000
NODE_ENV=production
```

## 📄 License

MIT

## 👥 Authors

- Original: Carlos Caballero
- Modernization: 2025

---

## 💡 Quick Tips

1. **Always run `prisma:generate` after schema changes**
2. **Use `prisma:studio` for quick data viewing/editing**
3. **Check `.env` file if database connection fails**
4. **Use `db:seed` to reset to known state**
5. **Run `npm run lint` before committing**

## 🎉 Happy Coding!

**Questions?** Check the documentation files or open an issue.

**Contributing?** PRs welcome! Please run `npm run lint` first.
