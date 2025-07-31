import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, UserIcon, ArrowLeftIcon, AlertCircleIcon } from 'lucide-react';
import { createUser } from '../backend/api/users';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('student');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (userType === 'admin' && adminKey !== 'admin123') {
      setError('Invalid admin key');
      return;
    }
    try {
      setIsSubmitting(true);
      await createUser({
        name,
        email,
        password,
        role: userType as 'student' | 'teacher' | 'admin',
        status: 'active'
      });
      if (userType === 'admin') {
        navigate('/admin-login');
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80"
              alt="Wildlife Guardians logo"
              className="w-10 h-10 rounded-full mr-3"
            />
            <h1 className="text-xl font-bold">Wildlife Guardians</h1>
          </div>
          <Link to="/login" className="flex items-center text-sm hover:text-white/80 transition-colors">
            <ArrowLeftIcon size={16} className="mr-1" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <UserIcon size={32} className="text-green-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Create an Account</h2>
            <p className="mt-2 text-sm text-gray-600">Join Wildlife Guardians to learn about conservation</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center">
                <AlertCircleIcon size={20} className="text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="student-type"
                      name="user-type"
                      type="radio"
                      value="student"
                      checked={userType === 'student'}
                      onChange={() => setUserType('student')}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="student-type" className="ml-2 block text-sm text-gray-700">
                      Student
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="teacher-type"
                      name="user-type"
                      type="radio"
                      value="teacher"
                      checked={userType === 'teacher'}
                      onChange={() => setUserType('teacher')}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="teacher-type" className="ml-2 block text-sm text-gray-700">
                      Teacher
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="admin-type"
                      name="user-type"
                      type="radio"
                      value="admin"
                      checked={userType === 'admin'}
                      onChange={() => setUserType('admin')}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="admin-type" className="ml-2 block text-sm text-gray-700">
                      Admin
                    </label>
                  </div>
                </div>
              </div>
              {userType === 'admin' && (
                <div>
                  <label htmlFor="admin-key" className="block text-sm font-medium text-gray-700">
                    Admin Key
                  </label>
                  <input
                    id="admin-key"
                    name="admin-key"
                    type="password"
                    required
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter admin key"
                  />
                  <p className="mt-1 text-xs text-gray-500">Please enter the admin key provided to you (hint: admin123)</p>
                </div>
              )}
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-green-600 hover:text-green-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-green-600 hover:text-green-500">
                    Privacy Policy
                  </a>
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating Account...' : 'Sign up'}
                </button>
              </div>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <footer className="bg-white py-4 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Wildlife Guardians. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Signup;