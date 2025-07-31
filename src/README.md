# Wildlife Guardians - Educational Conservation Platform
## Overview
Wildlife Guardians is an interactive educational platform designed to teach students about wildlife conservation in Rwanda. The platform offers quizzes, detailed information about endangered animals, and rewards users with badges for their achievements.
This application features separate interfaces for students and administrators, offline capabilities, and a responsive design for various devices.
![Wildlife Guardians Logo](https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80)
## Features
### For Students
- **Interactive Dashboard**: View progress, recent activity, and daily challenges
- **Wildlife Encyclopedia**: Learn about endangered animals in Rwanda
- **Interactive Quizzes**: Test knowledge about wildlife conservation
- **Achievement Badges**: Earn badges for completing quizzes and other activities
- **User Profiles**: Track personal progress and view earned badges
- **Search Functionality**: Find animals and quizzes easily
- **Offline Mode**: Access previously viewed content without internet connection
### For Administrators
- **User Management**: Create, edit, and manage user accounts
- **Content Management**: Add and edit animals, quizzes, and badges
- **Analytics Dashboard**: View platform usage statistics
- **System Settings**: Configure platform settings
## Technical Features
- **Progressive Web App (PWA)**: Works offline with service worker support
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Local Storage**: Caches content for offline access
- **IndexedDB**: Stores quiz results and user activity locally
- **Authentication**: Role-based access control (student, teacher, admin)
## Pages and Components
### Authentication
- **Login**: Separate login flows for students and administrators
- **Signup**: User registration with role selection
- **Password Recovery**: Reset forgotten passwords
### Student Interface
- **Dashboard**: Overview of progress and recent activity
- **Animals**: Browse and learn about endangered species
- **Quizzes**: Take quizzes about wildlife conservation
- **Badges**: View earned achievement badges
- **Profile**: Personal information and settings
- **Search**: Find content across the platform
### Admin Interface
- **Dashboard**: Overview of platform statistics
- **Users**: Manage user accounts
- **Animals**: Add and edit animal information
- **Quizzes**: Create and manage quizzes
- **Badges**: Design achievement badges
- **Settings**: Configure platform settings
- **Help**: Access support resources
### Special Features
- **Offline Banner**: Notifies users of connection status
- **ChatBot**: Provides assistance to students
- **Authors Page**: Information about the platform creators
- **Activity Tracking**: Monitors user progress and engagement
## Technical Architecture
### Frontend
- **React**: UI component library
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **IndexedDB**: Client-side database for offline data
### Backend (Simulated)
- **Supabase**: Database and authentication (simulated with localStorage for development)
- **Service Worker**: Enables offline functionality
## Offline Capabilities
Wildlife Guardians implements a comprehensive offline strategy:
1. **Service Worker**: Caches static assets and API responses
2. **IndexedDB**: Stores user data locally
3. **Offline Banner**: Indicates connection status
4. **Sync Mechanism**: Synchronizes local data when connection is restored
5. **Offline Page**: Dedicated page for offline experience
## Getting Started
### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
### Installation
1. Clone the repository:
   ```
   git clone https://github.com/your-username/wildlife-guardians.git
   cd wildlife-guardians
   ```
2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```
   npm start
   # or
   yarn start
   ```
4. Open http://localhost:3000 in your browser
### Default Login Credentials
#### Student Access
- Email: student@example.com
- Password: password
#### Admin Access
- Email: admin@example.com
- Password: admin123
- Admin Key: admin123 (for signup)
## Project Structure