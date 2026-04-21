# Issue Tracker — MERN Stack Application

A full-featured issue tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js) with TypeScript, JWT authentication, Zustand state management, and CSV/JSON export functionality.

---

## Live Demo

- **Frontend:** https://issue-tracker-client.vercel.app
- **Backend API:** https://issue-tracker-api.vercel.app/api/health

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Scripts](#scripts)

---

## Features

### Core
- Full CRUD operations for issues
- JWT-based user authentication (register, login, logout)
- Secure password hashing with bcrypt (12 salt rounds)
- Protected routes — all issue endpoints require authentication
- Issue management with title, description, status, priority, severity, and tags
- Status tracking — Open, In Progress, Resolved, Closed
- Priority levels — Low, Medium, High, Critical
- Severity levels — Minor, Major, Critical, Blocker
- Dashboard with status count summary widgets
- Issue detail page with full information
- Confirmation prompts for destructive actions (delete, resolve, close)
- Pagination — 10 issues per page

### Search & Filter
- Full-text search on title and description (MongoDB text index)
- Filter by status, priority, and severity
- Debounced search input — API called 500ms after user stops typing

### Bonus Features
- TypeScript on both frontend and backend
- Zustand state management with localStorage persistence
- Export issues to CSV and JSON
- Responsive design — mobile, tablet, desktop
- Visual badges for status and priority
- Reusable component design (Button, Badge, Modal, IssueCard)

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2.0 | UI library |
| TypeScript | 5.3.3 | Type safety |
| Vite | 5.0.10 | Build tool and dev server |
| Zustand | 4.4.7 | State management |
| React Router DOM | 6.21.1 | Client-side routing |
| Axios | 1.6.2 | HTTP client |
| Tailwind CSS | 4.2.2 | Utility-first styling |
| Lucide React | 0.303.0 | Icons |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20.x | Runtime |
| Express.js | 4.18.2 | Web framework |
| TypeScript | 5.3.3 | Type safety |
| Mongoose | 8.0.3 | MongoDB ODM |
| JSON Web Token | 9.0.2 | Authentication |
| bcryptjs | 2.4.3 | Password hashing |
| cors | 2.8.5 | Cross-origin requests |
| dotenv | 16.3.1 | Environment variables |
| ts-node-dev | 2.0.0 | Development server with hot reload |

### Database
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Mongoose | Schema modeling and validation |

---

## Folder Structure

```
Issue_Tracker/
├── .gitignore                          # Root gitignore
├── .gitattributes                      # Line ending configuration
├── README.md                           # This file
│
├── server/                             # Express.js Backend
│   ├── .env                            # Environment variables (not committed)
│   ├── .env.example                    # Environment variable template
│   ├── .gitignore                      # Server gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json                     # Vercel deployment config
│   └── src/
│       ├── app.ts                      # Express app entry point
│       ├── config/
│       │   └── db.ts                   # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.ts      # register, login, getMe
│       │   └── issue.controller.ts     # getIssues, getIssueById, createIssue, updateIssue, deleteIssue
│       ├── middleware/
│       │   ├── auth.middleware.ts      # JWT verification — protect()
│       │   └── error.middleware.ts     # Centralized error handler
│       ├── models/
│       │   ├── User.model.ts           # User schema — bcrypt pre-save hook
│       │   └── Issue.model.ts          # Issue schema — text index, compound index
│       ├── routes/
│       │   ├── auth.routes.ts          # /api/auth/*
│       │   └── issue.routes.ts         # /api/issues/* (all protected)
│       ├── types/
│       │   └── express.d.ts            # AuthRequest interface extending Express Request
│       └── utils/
│           └── asyncHandler.ts         # Wraps async controllers — forwards errors
│
└── client/                             # React + Vite Frontend
    ├── .env                            # Environment variables (not committed)
    ├── .env.example                    # Environment variable template
    ├── .env.production                 # Production environment variables
    ├── .gitignore                      # Client gitignore
    ├── index.html                      # Vite entry point
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts                  # Vite config with API proxy
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.tsx                    # React app entry point
        ├── App.tsx                     # Router setup with protected routes
        ├── index.css                   # Tailwind directives + base styles
        ├── vite-env.d.ts               # Vite environment type declarations
        ├── api/
        │   ├── axios.ts                # Axios instance — request/response interceptors
        │   ├── auth.api.ts             # Auth API calls
        │   └── issues.api.ts           # Issues API calls
        ├── components/
        │   ├── ui/                     # Reusable UI primitives
        │   │   ├── Badge.tsx           # Status and priority badges with color maps
        │   │   ├── Button.tsx          # Button with variant, size, loading spinner
        │   │   └── Modal.tsx           # Accessible modal — keyboard + scroll lock
        │   ├── issues/
        │   │   ├── IssueCard.tsx       # Issue card with badges, tags, actions
        │   │   ├── IssueForm.tsx       # Create/edit form with tag management
        │   │   ├── IssueFilters.tsx    # Search + status + priority filters
        │   │   └── StatusCounts.tsx    # Dashboard summary count widgets
        │   └── layout/
        │       ├── Navbar.tsx          # Sticky nav — user info, logout, mobile menu
        │       └── ProtectedRoute.tsx  # Redirects to login if not authenticated
        ├── hooks/
        │   ├── useIssues.ts            # CRUD operations — wraps issuesApi
        │   └── useDebounce.ts          # Debounce hook for search input
        ├── pages/
        │   ├── LoginPage.tsx           # Login form
        │   ├── RegisterPage.tsx        # Registration form with validation
        │   ├── DashboardPage.tsx       # Main dashboard — issue grid + filters
        │   └── IssueDetailPage.tsx     # Single issue view — edit + status change
        ├── store/
        │   ├── authStore.ts            # Zustand auth state — persisted to localStorage
        │   └── issueStore.ts           # Zustand issue state — client-side cache
        ├── types/
        │   └── index.ts                # Shared TypeScript interfaces and types
        └── utils/
            └── exportUtils.ts          # exportToCSV and exportToJSON helpers
```

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** v20 or higher — [nodejs.org](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- **Git** — [git-scm.com](https://git-scm.com)
- **MongoDB Atlas account** — [cloud.mongodb.com](https://cloud.mongodb.com) (free tier)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/issue-tracker.git
cd issue-tracker
```

### 2. Set up the Backend

```bash
cd server
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Fill in the values in `server/.env` (see [Environment Variables](#environment-variables) section below).

Start the development server:

```bash
npm run dev
```

Server runs at **http://localhost:5000**

### 3. Set up the Frontend

Open a new terminal:

```bash
cd client
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Fill in the values in `client/.env`.

Start the development server:

```bash
npm run dev
```

Client runs at **http://localhost:8080**

---

## Environment Variables

### `server/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/issue-tracker
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:8080
NODE_ENV=development
```

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server runs on | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWT tokens | Any long random string |
| `JWT_EXPIRES_IN` | JWT token expiry duration | `7d`, `24h`, `60m` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:8080` |
| `NODE_ENV` | Environment mode | `development` or `production` |

### `client/.env`

```env
VITE_API_URL=/api
```

| Variable | Description | Development | Production |
|---|---|---|---|
| `VITE_API_URL` | Base URL for all API calls | `/api` | `https://your-api.vercel.app/api` |

---

## API Documentation

### Base URL
```
Development:  http://localhost:5000/api
Production:   https://your-api.vercel.app/api
```

### Authentication Routes

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login and receive JWT token |
| GET | `/auth/me` | Yes | Get current authenticated user |

#### Register — `POST /auth/register`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response `201`:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login — `POST /auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response `200`:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Issue Routes

All issue routes require the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/issues` | Get all issues (with filters and pagination) |
| POST | `/issues` | Create a new issue |
| GET | `/issues/:id` | Get a single issue by ID |
| PUT | `/issues/:id` | Update an issue |
| DELETE | `/issues/:id` | Delete an issue |

#### Get All Issues — `GET /issues`

Query parameters:

| Parameter | Type | Description | Example |
|---|---|---|---|
| `search` | string | Search in title and description | `login bug` |
| `status` | string | Filter by status | `Open` |
| `priority` | string | Filter by priority | `High` |
| `severity` | string | Filter by severity | `Critical` |
| `page` | number | Page number | `1` |
| `limit` | number | Results per page | `10` |

Response `200`:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 3,
    "limit": 10
  },
  "statusCounts": [
    { "_id": "Open", "count": 10 },
    { "_id": "In Progress", "count": 8 },
    { "_id": "Resolved", "count": 5 },
    { "_id": "Closed", "count": 2 }
  ]
}
```

#### Create Issue — `POST /issues`

Request body:
```json
{
  "title": "Login button not working",
  "description": "Detailed description of the issue",
  "priority": "High",
  "severity": "Major",
  "tags": ["frontend", "auth"]
}
```

Valid values:
- `priority` — `Low` | `Medium` | `High` | `Critical`
- `severity` — `Minor` | `Major` | `Critical` | `Blocker`
- `status` (update only) — `Open` | `In Progress` | `Resolved` | `Closed`

#### Update Issue — `PUT /issues/:id`

Request body (all fields optional):
```json
{
  "title": "Updated title",
  "status": "In Progress",
  "priority": "Critical"
}
```

### Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad request — validation error or missing fields |
| `401` | Unauthorized — missing or invalid JWT token |
| `404` | Not found — issue or user does not exist |
| `409` | Conflict — email already registered |
| `500` | Internal server error |

---

## Deployment

### Deploy to Vercel

#### Backend

```bash
cd server
vercel
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add JWT_EXPIRES_IN
vercel env add CLIENT_URL
vercel env add NODE_ENV
vercel --prod
```

#### Frontend

```bash
cd client
vercel
vercel env add VITE_API_URL
vercel --prod
```

### Deploy to AWS EC2

#### Connect to EC2

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
```

#### Install dependencies on EC2

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
```

#### Clone and run

```bash
git clone https://github.com/YOUR_USERNAME/issue-tracker.git
cd issue-tracker/server && npm install && npm run build
pm2 start dist/app.js --name "issue-tracker-api"
pm2 startup && pm2 save
cd ../client && npm install && npm run build
sudo cp -r dist/* /var/www/html/
```

---

## Scripts

### Backend (`server/`)

| Script | Command | Description |
|---|---|---|
| Development | `npm run dev` | Start with hot reload via ts-node-dev |
| Build | `npm run build` | Compile TypeScript to JavaScript |
| Production | `npm start` | Run compiled JavaScript |

### Frontend (`client/`)

| Script | Command | Description |
|---|---|---|
| Development | `npm run dev` | Start Vite dev server on port 8080 |
| Build | `npm run build` | Type-check and build for production |
| Preview | `npm run preview` | Preview production build locally |

---

## Key Design Decisions

| Decision | Reason |
|---|---|
| `asyncHandler` wrapper | Eliminates try/catch in every controller — errors flow to central error middleware |
| `select: false` on password | Password never leaks in API responses — must be explicitly opted in |
| MongoDB compound + text indexes | Compound index speeds up filtered queries — text index enables full-text search |
| `Promise.all` in `getIssues` | Fetches data and count in parallel — roughly 2x faster than sequential |
| `useDebounce` hook | Prevents API call on every keystroke — fires 500ms after user stops typing |
| Zustand `persist` middleware | User stays logged in across page refreshes without re-authentication |
| `AuthRequest` interface | Explicit TypeScript type for authenticated requests — more reliable than `declare global` |
| Vite proxy in development | Eliminates CORS issues in development — `/api` forwarded to Express on port 5000 |

---

## Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature-name`
3. Commit your changes — `git commit -m "Add your feature"`
4. Push to the branch — `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

**Dilanka Nirmal**
- GitHub: [@dilankanirmal98](https://github.com/dilankanirmal98)
