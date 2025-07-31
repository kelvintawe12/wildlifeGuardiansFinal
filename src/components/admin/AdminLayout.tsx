import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
interface AdminLayoutProps {
  onLogout?: () => void;
}
const AdminLayout = ({
  onLogout
}: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  // Close sidebar on route change (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  return <div className="min-h-screen bg-gray-100">
      <AdminHeader toggleSidebar={toggleSidebar} onLogout={onLogout} />
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6 pt-20 md:ml-72 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>;
};
export default AdminLayout;