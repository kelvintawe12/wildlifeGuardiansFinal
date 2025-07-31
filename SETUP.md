# Wildlife Guardians Project - Setup Guide

This document provides detailed instructions for setting up the Wildlife Guardians project locally for development, building, and deployment.

---

## Project Overview

Wildlife Guardians is a React application built with TypeScript and Vite. It uses Supabase as the backend service and TailwindCSS for styling. The project is designed to help users report, track, and support wildlife protection efforts through a modern, user-friendly interface.

---

## Prerequisites

Before setting up the project, ensure you have the following installed on your system:

- **Node.js** (version 16 or higher recommended)  
  Download and install from [https://nodejs.org/](https://nodejs.org/)

- **npm** (comes bundled with Node.js)  
  Verify installation by running:
  ```bash
  node -v
  npm -v
  ```

---

## Installation

1. Clone the repository or download the project files to your local machine.

2. Open a terminal and navigate to the project root directory.

3. Install the project dependencies by running:
   ```bash
   npm install
   ```

This will install all required packages listed in `package.json`, including React, Vite, TailwindCSS, Supabase client, and development tools.

---

## Running the Development Server

To start the development server with hot module replacement and live reload, run:

```bash
npm run dev
```

This command uses Vite to serve the application locally. By default, it will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

Open this URL in your browser to view the app during development.

---

## Building for Production

To create an optimized production build of the application, run:

```bash
npm run build
```

This command uses Vite to bundle and optimize the app for deployment. The output files will be placed in the `dist` directory.

---

## Previewing the Production Build

To locally preview the production build, run:

```bash
npm run preview
```

This serves the contents of the `dist` directory on a local server so you can verify the production build before deployment.

---

## Linting

To check the code for linting errors and enforce code quality standards, run:

```bash
npm run lint
```

This uses ESLint configured for TypeScript and React to analyze the codebase.

---

## Supabase Backend Configuration

The project uses Supabase as the backend service. The Supabase client is configured in the file:

```
src/backend/config/supabase.ts
```

Currently, the Supabase URL and anon key are hardcoded in this file:

```typescript
const supabaseUrl = 'https://nroxhpehcivziorueujg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Note:** For production or more secure setups, it is recommended to move these keys to environment variables and update the code accordingly.

---

## Styling

The project uses TailwindCSS for styling. Tailwind is configured via:

- `tailwind.config.js`
- `postcss.config.js`

No additional setup is required beyond installing dependencies.

---

## TypeScript Configuration

TypeScript is used for type safety and improved developer experience. Configuration files include:

- `tsconfig.json`
- `tsconfig.node.json`

---

## Deployment

The project is configured for deployment on Vercel. The `vercel.json` file contains a rewrite rule to serve the SPA correctly:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

To deploy:

1. Connect your GitHub repository to Vercel.
2. Vercel will automatically detect the project and use the build command `npm run build`.
3. The output directory is `dist`.
4. The rewrite rule ensures client-side routing works correctly.

---

## Additional Notes

- The project uses Vite as the build tool and development server.
- React Router DOM is used for client-side routing.
- The Supabase client library is `@supabase/supabase-js`.
- ESLint is configured with TypeScript and React plugins for code quality.
- Icons are provided by `lucide-react`.

---

## Summary of Useful Commands

| Command           | Description                          |
|-------------------|------------------------------------|
| `npm install`     | Install dependencies                |
| `npm run dev`     | Start development server            |
| `npm run build`   | Build production bundle             |
| `npm run preview` | Preview production build locally   |
| `npm run lint`    | Run ESLint for code linting         |

---

This completes the setup instructions for the Wildlife Guardians project. If you encounter any issues or have questions, please refer to the project documentation or contact the project maintainer.
