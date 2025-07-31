import React from 'react';
import { MenuIcon, BellIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
interface AdminHeaderProps {
  toggleSidebar: () => void;
  onLogout?: () => void;
}
const AdminHeader = ({
  toggleSidebar,
  onLogout
}: AdminHeaderProps) => {
  return <header className="fixed w-full bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-4 md:hidden flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="Toggle menu">
            <MenuIcon size={24} />
          </button>
          <Link to="/admin/dashboard" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-2">
              WG
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 hidden sm:block">
                Wildlife Guardians
              </h1>
              <span className="text-xs text-gray-500 hidden sm:block">
                Admin Dashboard
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700 relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <BellIcon size={20} />
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <div className="hidden md:flex items-center border-l pl-4 border-gray-200">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
              <UserIcon size={16} className="text-indigo-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">
                Admin User
              </div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
          <button onClick={onLogout} className="ml-2 flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 px-3 transition-colors">
            <LogOutIcon size={16} className="mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>;
};
export default AdminHeader;