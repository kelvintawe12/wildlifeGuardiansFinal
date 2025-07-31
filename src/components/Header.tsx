import React, { useState, Component } from 'react';
import { MenuIcon, UserIcon, LogOutIcon, SearchIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
interface HeaderProps {
  toggleSidebar: () => void;
  onLogout?: () => void;
}
const Header = ({
  toggleSidebar,
  onLogout
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  return <header className="fixed w-full bg-gradient-to-r from-green-500 to-blue-500 text-white z-50 shadow-md">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-4 md:hidden" aria-label="Toggle menu">
            <MenuIcon size={24} />
          </button>
          <Link to="/dashboard" className="flex items-center">
            <img src="https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80" alt="Wildlife Guardians logo" className="w-10 h-10 rounded-full mr-2" />
            <h1 className="text-xl font-bold hidden sm:block">
              Wildlife Guardians
            </h1>
          </Link>
        </div>
        <form onSubmit={handleSearch} className="hidden md:flex items-center mx-4 flex-1 max-w-md">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={16} className="text-white/70" />
            </div>
            <input type="search" placeholder="Search animals, quizzes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white/20 border border-white/30 text-white placeholder-white/70 w-full pl-10 pr-4 py-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50" />
          </div>
        </form>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center">
            <UserIcon size={20} className="mr-1" />
            <span className="font-medium">Student</span>
          </div>
          <button onClick={onLogout} className="flex items-center text-sm bg-white/20 hover:bg-white/30 rounded-full py-1 px-3 transition-colors">
            <LogOutIcon size={16} className="mr-1" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>;
};
export default Header;