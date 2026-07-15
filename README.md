# CyberShield — Security Awareness Training Platform

A comprehensive cybersecurity awareness and incident management platform built with React, Convex, and WorkOS Auth. Designed for organizations to train employees on security best practices, simulate phishing attacks, track security incidents, and monitor training progress through detailed analytics.

**Live App:** [https://shields-olive.vercel.app](https://shields-olive.vercel.app)

---

## Features

### 🛡️ Incident Tracking
- **Report Incidents** — Users can report security incidents (phishing, malware, identity theft, data breaches, unauthorized access) with descriptions, urgency levels, and optional evidence file uploads.
- **Track Status** — Students can view their reported incidents grouped by status (Pending Review, Under Investigation, Resolved).
- **Admin Console** — Administrators get a full management interface with search, status filtering, status updates, admin notes/responses, evidence viewing, and incident deletion.
- **Evidence Upload** — Incident evidence files are stored securely via Convex's built-in file storage.
- **Real-time Updates** — Incident list auto-refreshes via Convex's reactive queries — no manual refresh needed.

### 🎣 Phishing Simulation Training
- **Interactive Quizzes** — Users are presented with 15 email/communication scenarios and must identify which are phishing attempts and which are legitimate.
- **Timed Challenges** — Each scenario has a 30-second time limit, with scoring based on correct answers.
- **Immediate Feedback** — After each answer, users receive feedback explaining why the scenario was or wasn't phishing.
- **Results & Scoring** — At the end of each simulation, users see their score, grade (A–F), and detailed breakdowns.
- **Simulation Management (Admin)** — Admins can create, edit, and delete phishing scenarios with custom JSON content, difficulty levels, and phishing/legitimate classification.

### 📚 Training & Awareness Center
- **Video Library** — 35+ curated cybersecurity training videos organized into categories:
  - Phishing Awareness (5 videos)
  - Password Security (12 videos)
  - Multi-Factor Authentication / MFA (18 videos)
- **Category Browsing** — Videos are grouped by category with an accordion navigation and responsive grid layout.
- **YouTube Integration** — Videos are embedded via YouTube URLs with automatic ID extraction.
- **Admin Management** — Admins can add, edit, and delete videos through a dedicated management interface.

### 📊 Analytics Dashboard
- **Performance Tracking** — Track simulation scores over time with interactive line and bar charts (powered by Recharts).
- **Stats Summary** — Best score, average score, total simulation attempts, and latest grade displayed prominently.
- **Score Trend** — Line chart visualizing score progression across all simulation attempts.
- **Correct Answers Breakdown** — Bar chart showing correct answers per attempt.
- **Simulation History** — Chronological list of all completed simulations with dates, scores, grades, and time taken.

### 🔐 Authentication & Authorization
- **WorkOS Auth** — Enterprise-grade authentication with Google SSO via WorkOS AuthKit.
- **Role-Based Access** — Users are automatically assigned "student" or "admin" roles based on their email address.
- **Protected Routes** — Unauthenticated users are redirected to the landing page; authenticated users are redirected to the dashboard.
- **Session Management** — Persistent sessions via WorkOS secure cookies with automatic token refresh.

### 🖥️ Landing Page
- **Hero Section** — Bold headline with CyberShield branding and call-to-action.
- **Features Section** — Grid showcasing platform capabilities (Phishing Simulations, Incident Tracking, Training Library, Analytics).
- **Stats Section** — Animated counter statistics demonstrating platform impact.
- **How It Works** — Step-by-step walkthrough of the training and reporting workflow.
- **CTA Section** — Final call-to-action prompting users to get started.
- **Responsive Navigation** — Mobile-optimized bottom nav bar and desktop top nav with smooth tab switching.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type-safe development |
| **Vite 5** | Build tool and dev server |
| **Tailwind CSS 3** | Utility-first styling |
| **shadcn/ui** | Accessible, customizable UI components (built on Radix UI primitives) |
| **React Router v6** | Client-side routing with protected/public route guards |
| **Framer Motion** | Animations and page transitions |
| **Recharts** | Interactive analytics charts |
| **React Hook Form + Zod** | Form validation |
| **date-fns** | Date formatting |

### Backend
| Technology | Purpose |
|------------|---------|
| **Convex** | Full-stack backend: real-time database, server functions (queries/mutations), file storage, schema management |
| **WorkOS AuthKit** | Authentication: Google SSO, session management, JWT handling |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting and deployment |
| **Convex Cloud** | Backend hosting, database, serverless functions |
| **WorkOS** | Authentication provider |
| **GitHub** | Source control |

---

## Architecture

### Data Flow
```
User Browser
  ↓ ↑
React App (Vite SPA)
  ↓ useQuery / useMutation          ↓ WorkOS AuthKit
Convex Backend (Cloud)          WorkOS Auth (SSO)
  ↓                                      ↓
Convex Database               Google / Password
(Postgres-document hybrid)
```

### Project Structure
```
shieldwise-labs-main/
├── convex/                    # Convex backend (schema, queries, mutations)
│   ├── schema.ts             # Database schema with all table definitions
│   ├── auth.ts               # WorkOS auth integration
│   ├── incidents.ts          # Incident CRUD operations
│   ├── phishingSimulations.ts # Phishing scenario management
│   ├── simulationResults.ts   # Simulation results storage
│   ├── trainingVideos.ts     # Training video library
│   ├── profiles.ts           # User profile queries
│   ├── userRoles.ts          # Role-based access helpers
│   ├── users.ts              # User profile creation & admin check
│   ├── userManagement.ts     # Admin user deletion
│   └── _generated/           # Auto-generated Convex type bindings
├── src/
│   ├── components/
│   │   ├── auth/             # AuthModal, ProtectedRoute, PublicOnlyRoute
│   │   ├── dashboard/
│   │   │   ├── incidents/    # Incident tracking, admin console, report form
│   │   │   ├── phishing/     # Simulation UI, scenario management, results
│   │   │   ├── training/     # Video management
│   │   │   ├── analytics/    # Analytics dashboard with charts
│   │   │   ├── admin/        # User management
│   │   │   └── ...           # DashboardNav, TrainingTab, etc.
│   │   ├── landing/          # Landing page sections (Hero, Features, etc.)
│   │   └── ui/               # shadcn/ui components
│   ├── contexts/
│   │   └── AuthContext.tsx    # Auth state provider wrapping WorkOS
│   ├── hooks/                 # Custom React hooks (useIncidents, useAuth, etc.)
│   ├── pages/                 # Route pages (Index, Dashboard, NotFound)
│   └── lib/                   # Utility functions
├── dist/                      # Production build output
├── public/                    # Static assets
├── supabase/                  # Supabase integration (legacy, migrated to Convex)
└── TRAINING_VIDEOS.md         # Training video catalog reference
```

### Convex Database Schema
| Table | Description | Key Indexes |
|-------|-------------|-------------|
| `profiles` | User profile data (userId, fullName, email) | `by_userId` |
| `userRoles` | Role assignments (userId, role: admin/student) | `by_userId`, `by_userId_role` |
| `incidents` | Security incident reports | `by_studentId`, `by_status` |
| `phishingSimulations` | Phishing simulation scenarios | `by_createdBy` |
| `simulationResults` | User simulation attempt results | `by_userId`, `by_userId_completedAt` |
| `trainingVideos` | Training video library | `by_category` |

---

## Getting Started

### Prerequisites
- Node.js 18+ (recommended: install via [nvm](https://github.com/nvm-sh/nvm))
- npm or bun

### Local Development

1. **Clone the repository**
   ```sh
   git clone https://github.com/GustavoDGoat/Shields.git
   cd Shields
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   ```sh
   # Create .env.local with:
   VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud
   VITE_CONVEX_SITE_URL=https://your-convex-site.convex.site
   ```

4. **Start the development server**
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

### Convex Development
```sh
# Start local Convex backend (for development)
npx convex dev

# Deploy functions to Convex cloud (for production)
npx convex deploy --cmd 'npm run build' --cmd-url-env-var-name VITE_CONVEX_URL

# Run Convex functions from CLI
npx convex run trainingVideos:list
```

---

## Deployment

### Frontend (Vercel)
```sh
# Link to existing Vercel project
npx vercel link

# Deploy to production
npx vercel --prod
```

The `vercel.json` file configures SPA fallback routing so React Router handles client-side navigation.

### Environment Variables (Vercel)
| Variable | Value |
|----------|-------|
| `VITE_CONVEX_URL` | Your Convex cloud deployment URL |
| `VITE_WORKOS_CLIENT_ID` | Your WorkOS AuthKit client ID |

---

## Admin Access

Users with the following email addresses are automatically granted the **admin** role upon signing in:
- `gustavodgoat@gmail.com`
- `williamsjoshuas067@gmail.com`

Admins can toggle between Student View and Admin View using the switch in the Incident Tracking tab. Admin features include:
- Full incident management console (view all, update status, add notes, delete)
- Phishing simulation CRUD (create, edit, delete scenarios)
- Training video management (add, edit, delete videos)
- User management (view all users, delete users)

---

## API Reference

All backend logic is exposed through Convex queries and mutations:

### Queries
| Function | Args | Returns |
|----------|------|---------|
| `incidents.list` | `{ userId, isAdmin }` | All incidents (admin) or user's incidents |
| `trainingVideos.list` | — | All videos sorted by category |
| `phishingSimulations.list` | — | All scenarios |
| `simulationResults.listByUser` | `{ userId }` | User's results sorted by completion date |
| `users.getProfile` | `{ userId }` | User profile + roles |
| `users.isAdmin` | `{ userId }` | Boolean |
| `profiles.list` | `{ userId }` | All profiles with roles (admin only) |
| `userRoles.hasRole` | `{ userId, role }` | Boolean |

### Mutations
| Function | Args | Description |
|----------|------|-------------|
| `incidents.create` | `{ studentId, incidentType, description, urgencyLevel, evidenceStorageId? }` | Create incident report |
| `incidents.updateStatus` | `{ id, status, userId }` | Update incident status (admin) |
| `incidents.addAdminNote` | `{ id, note, userId }` | Add admin response note (admin) |
| `incidents.remove` | `{ id, userId }` | Delete incident (admin) |
| `incidents.generateUploadUrl` | — | Get file upload URL for evidence |
| `trainingVideos.create` | `{ title, description, youtubeUrl, category, userId }` | Add video (admin) |
| `trainingVideos.update` | `{ id, ...fields, userId }` | Edit video (admin) |
| `trainingVideos.remove` | `{ id, userId }` | Delete video (admin) |
| `phishingSimulations.create` | `{ title, description, difficultyLevel, content, isPhishing, createdBy }` | Add scenario (admin) |
| `phishingSimulations.update` | `{ id, ...fields, userId }` | Edit scenario (admin) |
| `phishingSimulations.remove` | `{ id, userId }` | Delete scenario (admin) |
| `simulationResults.create` | `{ userId, score, totalQuestions, correctAnswers, grade, completedAt, timeTakenSeconds? }` | Save simulation result |
| `users.createProfile` | `{ userId, fullName?, email? }` | Create/ensure user profile + role |
| `userManagement.deleteUser` | `{ targetUserId, adminUserId }` | Delete user and all data (admin) |

---

## Legacy

This project was originally built with **Supabase** (Postgres database, Supabase Auth, Supabase Storage) and was fully migrated to **Convex** (database, server functions, file storage) + **WorkOS AuthKit** (authentication). All Supabase dependencies have been removed from the codebase.

---

## License

MIT
