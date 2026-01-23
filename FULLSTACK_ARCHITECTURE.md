# Dullstroom Digital - Full-Stack Architecture

## Problem:

- Current structure is frontend-only (Vite/React)
- Need to add backend APIs and database connections
- Need clear separation between client and server

## Solution: Monorepo Structure

```
dullstroom-digital/
├── client/                      # Frontend (Vite + React)
│   ├── src/
│   │   ├── features/
│   │   │   ├── admin/
│   │   │   ├── businesses/
│   │   │   ├── bookings/
│   │   │   └── community/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   ├── services/          # API calls to backend
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend (Node.js + Express)
│   ├── src/
│   │   ├── api/               # API routes
│   │   │   ├── routes/
│   │   │   │   ├── auth.js
│   │   │   │   ├── businesses.js
│   │   │   │   ├── bookings.js
│   │   │   │   ├── community.js
│   │   │   │   └── users.js
│   │   │   └── middleware/
│   │   │       ├── auth.js
│   │   │       ├── validation.js
│   │   │       └── errorHandler.js
│   │   ├── database/
│   │   │   ├── models/
│   │   │   │   ├── User.js
│   │   │   │   ├── Business.js
│   │   │   │   ├── Booking.js
│   │   │   │   └── Post.js
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   ├── services/          # Business logic
│   │   │   ├── authService.js
│   │   │   ├── businessService.js
│   │   │   ├── bookingService.js
│   │   │   └── emailService.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── env.js
│   │   └── app.js
│   ├── package.json
│   └── .env
│
├── shared/                      # Shared code (types, constants)
│   ├── types/
│   │   ├── User.ts
│   │   ├── Business.ts
│   │   └── Booking.ts
│   └── constants/
│       └── roles.js
│
├── package.json                 # Root package (workspaces)
└── README.md
```

## Benefits

### 1. Clear Separation

- Frontend code stays in `client/`
- Backend code stays in `server/`
- Shared code in `shared/`

### 2. Independent Development

- Frontend and backend can be developed separately
- Different teams can work on each
- Can deploy separately if needed

### 3. Shared Dependencies

- Common packages in root `node_modules`
- Type safety across frontend/backend
- Consistent tooling

## Technology Stack

### Frontend (Client)

```json
{
  "framework": "Vite + React",
  "styling": "Tailwind CSS",
  "state": "React Context / Zustand",
  "http": "Fetch API",
  "maps": "Leaflet"
}
```

### Backend (Server)

```json
{
  "runtime": "Node.js",
  "framework": "Express.js",
  "database": "PostgreSQL (via Supabase)",
  "orm": "Prisma / Supabase Client",
  "auth": "Supabase Auth / JWT",
  "validation": "Zod",
  "email": "Resend / SendGrid"
}
```

## Root package.json (Workspaces)

```json
{
  "name": "dullstroom-digital",
  "private": true,
  "workspaces": ["client", "server", "shared"],
  "scripts": {
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "npm run dev --workspace=client",
    "dev:server": "npm run dev --workspace=server",
    "build": "npm run build --workspace=client",
    "start": "npm start --workspace=server"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

## Migration Steps

### Option A: Keep Current Structure (Simpler)

Current Vite app stays as-is, add backend separately:

```
sadev/
├── src/              # Frontend (current)
├── server/           # NEW: Backend
└── package.json
```

### Option B: Full Monorepo (Recommended - Best Practice)

Restructure everything:

```
sadev/
├── client/           # Move current src/ here
├── server/           # NEW: Backend
├── shared/           # NEW: Shared code
└── package.json      # Workspaces config
```

## Recommended: Option B (Full Monorepo)

**Why?**

- Industry standard
- Scalable for team growth
- Clean separation
- Easy to deploy separately later
- Type safety across stack

## Next Steps

1. ✅ Create server folder structure
2. ✅ Setup Express server
3. ✅ Configure Supabase connection
4. ✅ Create API routes
5. ✅ Setup database models
6. ✅ Move client code to client/ folder
7. ✅ Configure workspaces in root package.json
8. ✅ Update imports and paths

## Database Schema (Supabase PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  tier TEXT DEFAULT 'free',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES users(id),
  board_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  accommodation_id UUID NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints Structure

```
/api/v1/
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── POST /logout
│
├── /businesses
│   ├── GET    /           # List all
│   ├── GET    /:id        # Get one
│   ├── POST   /           # Create (auth required)
│   ├── PUT    /:id        # Update (auth required)
│   └── DELETE /:id        # Delete (admin only)
│
├── /bookings
│   ├── GET    /           # List user's bookings
│   ├── POST   /           # Create booking
│   └── PATCH  /:id/status # Update status
│
├── /posts
│   ├── GET    /           # List posts
│   ├── POST   /           # Create post
│   └── DELETE /:id        # Delete (auth required)
│
└── /users (admin only)
    ├── GET    /           # List users
    ├── GET    /:id        # Get user
    ├── PATCH  /:id/role   # Update role
    └── DELETE /:id        # Delete user
```

## Environment Variables

### Client (.env)

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Server (.env)

```env
PORT=5000
DATABASE_URL=postgresql://...
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
```

## Decision Time

**Which structure do you prefer?**

**Option A**: Keep frontend as-is, add `server/` folder

- ✅ Faster to implement
- ✅ Less disruption
- ❌ Not as clean
- ❌ Harder to scale

**Option B**: Full monorepo restructure

- ✅ Industry best practice
- ✅ Cleaner separation
- ✅ Easier to scale
- ❌ Requires moving files
- ❌ Takes more time upfront

**Recommendation**: Option B for long-term success

Shall I proceed with Option B and create the full monorepo structure?
