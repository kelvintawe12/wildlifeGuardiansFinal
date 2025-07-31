import React, { useEffect, useState } from 'react';
import { User, UserInput } from '../../../backend/api/users';
interface UserFormProps {
  user?: User;
  onSubmit: (user: UserInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setStatus(user.status);
      setAvatarUrl(user.avatar_url || '');
      setPassword(''); // Don't populate password for existing users
    } else {
      // Reset form for new user
      setName('');
      setEmail('');
      setRole('student');
      setStatus('active');
      setAvatarUrl('');
      setPassword('');
    }
  }, [user]);
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!user && !password.trim()) newErrors.password = 'Password is required for new users';
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) newErrors.email = 'Please enter a valid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const userData: UserInput = {
      name,
      email,
      role,
      status,
      avatar_url: avatarUrl || undefined
    };
    // Only include password for new users or if changed for existing users
    if (password) {
      ;
      (userData as any).password = password;
    }
    onSubmit(userData);
  };
  return <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {user ? 'Password (leave blank to keep unchanged)' : 'Password *'}
          </label>
          <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className={`mt-1 block w-full rounded-md border ${errors.password ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
        <div>
          <label htmlFor="avatar-url" className="block text-sm font-medium text-gray-700">
            Avatar URL
          </label>
          <input type="url" id="avatar-url" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://example.com/avatar.jpg" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select id="role" value={role} onChange={e => setRole(e.target.value as any)} className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select id="status" value={status} onChange={e => setStatus(e.target.value as any)} className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-5">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
          {isSubmitting ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>;
};
export default UserForm;