import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, ShieldIcon, AlertCircleIcon } from 'lucide-react';
const AdminLogin = ({
  onLogin
}: {
  onLogin: () => void;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setIsSubmitting(true);
      // In a real app, this would be an API call to authenticate the admin
      // For now, simulate authentication with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      // Check if the user exists in the "database" (localStorage)
      // In a real app, this would be a server-side check
      const storedEmail = localStorage.getItem('userEmail');
      const storedRole = localStorage.getItem('userRole');
      const storedUserId = localStorage.getItem('userId');
      if (storedEmail === email && storedRole === 'admin') {
        // Set session
        localStorage.setItem('currentUser', JSON.stringify({
          email,
          role: 'admin',
          id: storedUserId,
          name: 'Admin User' // In a real app, this would come from the database
        }));
        // Call the login handler from App.tsx with admin=true
        onLogin();
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-indigo-600 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold mr-3">
            WG
          </div>
          <div>
            <h1 className="text-xl font-bold">Wildlife Guardians</h1>
            <p className="text-xs text-indigo-200">Admin Portal</p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
              <ShieldIcon size={32} className="text-indigo-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Access the administrator dashboard
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center">
                <AlertCircleIcon size={20} className="text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button type="submit" disabled={isSubmitting} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Need an admin account?{' '}
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-800">
              Student Login
            </Link>
          </div>
        </div>
      </div>
      <footer className="bg-white py-4 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Wildlife Guardians. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>;
};
export default AdminLogin;