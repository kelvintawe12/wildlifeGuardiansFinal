import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Status from './Status';
import { PWAInstall } from '../pages/pwainstall';

interface LayoutProps {
  onLogout?: () => void;
}
const Layout = ({
  onLogout
}: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header toggleSidebar={toggleSidebar} onLogout={onLogout} />
      <Status />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 p-4 md:p-6 pt-20 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <PWAInstall />
    </div>;
};
export default Layout;
