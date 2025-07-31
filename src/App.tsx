import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Signup from './pages/Signup';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Badges from './pages/Badges';
import AnimalInfo from './pages/AnimalInfo';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminQuizzes from './pages/admin/AdminQuizzes';
import AdminBadges from './pages/admin/AdminBadges';
import AdminAnimals from './pages/admin/AdminAnimals';
import AdminUserCreate from './pages/admin/AdminUserCreate';
import AdminQuizCreate from './pages/admin/AdminQuizCreate';
import AdminBadgeCreate from './pages/admin/AdminBadgeCreate';
import AdminAnimalCreate from './pages/admin/AdminAnimalCreate';
import Offline from './pages/Offline';
import OfflineBanner from './components/OfflineBanner';
import ChatBot from './components/ChatBot';
import Search from './pages/Search';
import Profile from './pages/Profile';
import AdminSettings from './pages/admin/AdminSettings';
import AdminHelp from './pages/admin/AdminHelp';
import Authors from './pages/Authors';
import AdminActivity from './pages/admin/AdminActivity';
export function App() {
  // Since we're implementing basic authentication, we'll use local storage
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    // Check if user is already logged in from localStorage
    const checkLoggedInStatus = () => {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        setIsLoggedIn(true);
        setIsAdmin(userData.role === 'admin');
      }
    };
    checkLoggedInStatus();
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
      });
    }
    // Set up online/offline listeners (handlers removed since state is not used)
    const handleOnline = () => {
      console.log('You are online');
    };
    const handleOffline = () => {
      console.log('You are offline');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      // No cleanup needed since no listeners are added
    };
  }, []);
  const handleLogin = (admin = false) => {
    setIsLoggedIn(true);
    setIsAdmin(admin);
  };
  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };
  return <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={!isLoggedIn ? <Login onLogin={() => handleLogin(false)} /> : isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin-login" element={!isLoggedIn ? <AdminLogin onLogin={() => handleLogin(true)} /> : isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={<Signup />} />
        {/* Offline Route */}
        <Route path="/offline" element={<Offline />} />
        {/* Student Routes */}
        <Route path="/" element={isLoggedIn && !isAdmin ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="badges" element={<Badges />} />
          <Route path="animals" element={<AnimalInfo />} />
          <Route path="search" element={<Search />} />
          <Route path="profile" element={<Profile />} />
          <Route path="authors" element={<Authors />} />
        </Route>
        {/* Admin Routes */}
        <Route path="/admin" element={isLoggedIn && isAdmin ? <AdminLayout onLogout={handleLogout} /> : <Navigate to="/admin-login" replace />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* User Management */}
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/create" element={<AdminUserCreate />} />
          <Route path="users/edit/:id" element={<AdminUserCreate />} />
          {/* Quiz Management */}
          <Route path="quizzes" element={<AdminQuizzes />} />
          <Route path="quizzes/create" element={<AdminQuizCreate />} />
          <Route path="quizzes/edit/:id" element={<AdminQuizCreate />} />
          {/* Badge Management */}
          <Route path="badges" element={<AdminBadges />} />
          <Route path="badges/create" element={<AdminBadgeCreate />} />
          <Route path="badges/edit/:id" element={<AdminBadgeCreate />} />
          {/* Animal Management */}
          <Route path="animals" element={<AdminAnimals />} />
          <Route path="animals/create" element={<AdminAnimalCreate />} />
          <Route path="animals/edit/:id" element={<AdminAnimalCreate />} />
          {/* Settings & Help */}
          <Route path="settings" element={<AdminSettings />} />
          <Route path="help" element={<AdminHelp />} />
          <Route path="activity" element={<AdminActivity />} />
          <Route path="authors" element={<Authors />} />
        </Route>
        {/* Fallback */}
        <Route path="*" element={<Navigate to={isLoggedIn ? isAdmin ? '/admin/dashboard' : '/dashboard' : '/login'} replace />} />
      </Routes>
      {/* Global components */}
      {isLoggedIn && <>
          <OfflineBanner />
          {!isAdmin && <ChatBot />}
        </>}
    </Router>;
}