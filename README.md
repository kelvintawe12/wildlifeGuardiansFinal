# Wildlife Guardians

A wildlife education platform for students, teachers, and admins.

## Screenshots
<p align="center">
  <img src="public/images/screenshot-dashboard.png" alt="Dashboard Screenshot" width="800" />

  <img src="public/images/screenshot-quiz-list.png" alt="Quiz List Screenshot" width="400" style="margin-top: 2rem;" />
</p>

A full-stack wildlife education platform built with React, TypeScript, Vite, TailwindCSS, and Supabase.

## Features
- User authentication (students, teachers, admins)
- Quiz system with real-time results and badges
- Admin dashboard for managing users, quizzes, badges, and animals
- Offline support (PWA)
- Real-time updates and progress tracking
- Responsive, modern UI

## Tech Stack
- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Other:** Service Worker, PWA, LocalStorage sync

## Project Structure
```
├── public/                # Static assets, icons, manifest, service worker
│   ├── images/            # App screenshots, animal images
│   ├── icons/             # SVG icons
│   ├── ...                # App icons, manifest, sw.js
├── src/                   # All source code
│   ├── backend/           # API logic, Supabase config, migrations
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route-based pages (Dashboard, Quiz, Admin, etc.)
│   ├── utils/             # Utility functions (offline sync, storage)
│   ├── App.tsx            # Main app entry
│   └── index.tsx          # React root
├── index.html             # Main HTML entry
├── package.json           # Project metadata and scripts
├── package-lock.json      # NPM lockfile
├── tailwind.config.js     # TailwindCSS config
├── tsconfig.json          # TypeScript config
├── tsconfig.node.json     # Node-specific TS config
├── vite.config.ts         # Vite build config
├── .eslintrc.cjs          # ESLint config
├── .gitignore             # Git ignore rules
├── vercel.json            # Vercel deployment config
├── SETUP.md               # Setup and environment notes
└── README.md              # Project documentation
```

## Setup & Installation
1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd wildlifeGuardiansFinal
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure Supabase:**
   - Create a project at [supabase.com](https://supabase.com/)
   - Copy your Supabase URL and anon/public key
   - Update `src/backend/config/supabase.ts` with your credentials
4. **Run the app locally:**
   ```sh
   npm run dev
   ```
5. **Build for production:**
   ```sh
   npm run build
   ```

## Database Schema (Supabase)
- **users**: id, email, name, password, role, status, join_date, created_at, updated_at
- **quizzes**: id, title, animal_id, ...
- **quiz_results_final**: id, user_id, quiz_id, score, max_score, completed_at
- **badges**: id, name, description, ...
- **user_badges**: id, user_id, badge_id, awarded_at
- **animals**: id, name, ...

> See `src/backend/migrations/schema.ts` for full schema and seed scripts.

## Admin & User Accounts
- **Signup:** Students, teachers, and admins can sign up via the app.
- **Admin Key:** To create an admin, use the admin key (`admin123` by default).
- **Login:** Admins use the Admin Login page; students/teachers use the main login.

## Offline & PWA
- The app works offline and syncs data when back online.
- Installable as a PWA on desktop and mobile.

## Contributing
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License
MIT

---

**Wildlife Guardians** © 2025 kelvintawe12. All rights reserved.
