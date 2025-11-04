# ⚡ Quick Start Guide - Clock-In/Out System

> Get up and running in 5 minutes!

## 🎯 Prerequisites Check

Before starting, ensure you have:

```bash
# Check Node.js version (need 20+)
node --version
# Should show v20.x.x or higher

# Check npm version
npm --version
# Should show 10.x.x or higher

# Check PostgreSQL
psql --version
# Should show 12.x or higher
```

## 🚀 Installation (3 Steps)

### Step 1: Clone & Setup

```bash
# If you haven't cloned yet
git clone <your-repo-url>
cd clock-in-out

# Run automated setup
chmod +x setup.sh
./setup.sh
```

### Step 2: Configure Database

Edit `server/env/default.ts`:

```typescript
export const database = {
  host: 'localhost',
  port: 5432,
  username: 'your_username',
  password: 'your_password',
  database: 'clock_in_out'
};
```

Create the database:

```bash
# In PostgreSQL
createdb clock_in_out

# Or using psql
psql -U postgres -c "CREATE DATABASE clock_in_out;"
```

### Step 3: Start Development Servers

```bash
# Option A: Start both at once (from root)
npm run dev

# Option B: Start separately

# Terminal 1 - Backend
cd server
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/users

## 📱 Using the Application

### Dashboard (Main View)

1. Open http://localhost:4200
2. You'll see two sections:
   - **Present Employees** (green) - Currently checked in
   - **Absent Employees** (red) - Not checked in or checked out
3. The page auto-refreshes every 3 seconds

### Register NFC Cards

1. Navigate to http://localhost:4200/user
2. Select an employee from the dropdown
3. Enter their NFC card UID
4. Click "Register Card"
5. You'll see a success notification

## 🔧 Common Commands

### Frontend Commands

```bash
cd frontend

# Development
npm start                 # Start dev server
npm run build            # Production build
npm run lint             # Check code quality
npm test                 # Run tests

# Build for specific environment
npm run build -- --configuration=production
```

### Backend Commands

```bash
cd server

# Development
npm run start:dev        # Start with hot reload
npm run start:debug      # Start with debugger
npm run build            # Build for production
npm run start:prod       # Run production build

# Testing
npm test                 # Run unit tests
npm run test:watch       # Watch mode
npm run test:cov         # With coverage
npm run test:e2e         # E2E tests

# Database
npm run init:db          # Initialize with test data
```

### Root Commands

```bash
# From project root

npm run setup            # Install all dependencies
npm run dev              # Start both servers
npm run build            # Build both projects
npm run lint             # Lint both projects
npm run test             # Test both projects
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Frontend (4200)
# Kill process on port 4200
lsof -ti:4200 | xargs kill -9

# Backend (3000)
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verify credentials in `server/env/default.ts`
3. Ensure database exists:
   ```bash
   psql -U postgres -l
   ```

### Module Not Found Errors

```bash
# Clean install frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Clean install backend
cd server
rm -rf node_modules package-lock.json
npm install
```

### Angular Build Errors

```bash
cd frontend

# Clear Angular cache
rm -rf .angular

# Clear all caches
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

1. Check your Node version: `node --version` (need 20+)
2. Delete and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📊 Test Data

To populate the database with test data:

```bash
cd server
npm run init:db
```

This will create sample employees and schedules.

## 🔐 Environment Variables

### Frontend (`frontend/src/environments/`)

**environment.ts** (development):
```typescript
export const environment = {
  production: false,
  APIENDPOINT_BACKEND: 'http://localhost:3000'
};
```

**environment.prod.ts** (production):
```typescript
export const environment = {
  production: true,
  APIENDPOINT_BACKEND: 'https://your-api-domain.com'
};
```

### Backend (`server/env/`)

**default.ts** (development):
```typescript
export const env = {
  port: 3000,
  database: {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'clock_in_out'
  }
};
```

## 📖 Next Steps

1. ✅ **Read MODERNIZATION.md** for detailed upgrade information
2. ✅ **Review UPGRADE_SUMMARY.md** for what changed
3. ✅ **Check the code** in `frontend/src/app/` and `server/src/`
4. ✅ **Customize** the styling in `frontend/src/styles.scss`
5. ✅ **Add features** you need for your use case

## 🎓 Learning Resources

### Frontend
- [Angular Tutorial](https://angular.io/tutorial)
- [Material Components](https://material.angular.io/components/categories)
- [Tailwind Docs](https://tailwindcss.com/docs)

### Backend
- [NestJS First Steps](https://docs.nestjs.com/first-steps)
- [TypeORM Guide](https://typeorm.io/#/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

## 💡 Pro Tips

1. **Use Chrome DevTools**: Press F12 to debug frontend issues
2. **Check Network Tab**: Monitor API calls in real-time
3. **Use VS Code**: Best IDE for this stack with extensions:
   - Angular Language Service
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense

4. **Hot Reload**: Both servers support hot reload - changes appear instantly!

5. **API Testing**: Use tools like:
   - Postman
   - Thunder Client (VS Code extension)
   - cURL commands

## 🎨 Customization

### Change Theme Colors

Edit `frontend/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',  // Change primary color
        // ... more shades
      }
    }
  }
}
```

### Modify Polling Interval

Edit `frontend/src/app/ticketing/ticketing.component.ts`:

```typescript
const interval$ = timer(0, 3000); // Change 3000 to your desired ms
```

## 📞 Getting Help

- **Documentation**: Check MODERNIZATION.md and UPGRADE_SUMMARY.md
- **Issues**: Check existing GitHub issues
- **Logs**: Check browser console and terminal output

## ✅ Success Checklist

- [ ] Node.js 20+ installed
- [ ] PostgreSQL running
- [ ] Database created
- [ ] Dependencies installed (ran setup.sh)
- [ ] Backend running on :3000
- [ ] Frontend running on :4200
- [ ] Can see the dashboard
- [ ] Can register NFC cards

---

**Ready to code?** 🚀

```bash
npm run dev
```

Then open http://localhost:4200 and enjoy your modernized clock-in/out system!

