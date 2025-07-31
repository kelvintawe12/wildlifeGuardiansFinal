import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboardIcon, UsersIcon, FileQuestionIcon, AwardIcon, LeafIcon, SettingsIcon, HelpCircleIcon, XIcon, PlusCircleIcon, ListIcon, UserPlusIcon, BookPlusIcon, ShieldIcon, ChevronDownIcon, LogOutIcon } from 'lucide-react';
interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userName?: string;
  userEmail?: string;
}

const AdminSidebar = ({
  isOpen,
  setIsOpen,
  userName = 'Admin User',
  userEmail = 'admin@example.com'
}: AdminSidebarProps) => {
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  // Track expanded sections for accordion-style submenus
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  // Auto-expand section based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    // Check which section should be expanded based on the current path
    navGroups.forEach(group => {
      group.items.forEach(item => {
        if (item.subItems && item.subItems.some(subItem => currentPath.startsWith(subItem.path))) {
          setExpandedSections(prev => ({
            ...prev,
            [item.name]: true
          }));
        }
      });
    });
  }, []);
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);
  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };
  // Check if a parent route or any of its children is active
  const isRouteActive = (path: string, subItems?: any[]) => {
    if (location.pathname === path) return true;
    if (subItems) {
      return subItems.some(item => location.pathname.startsWith(item.path));
    }
    return false;
  };
  // Group navigation items
  interface NavItem {
    name: string;
    path: string;
    icon: JSX.Element;
    subItems?: NavItem[];
  }

  const navGroups: { title: string; items: NavItem[] }[] = [
    {
      title: 'Dashboard',
      items: [
        {
          name: 'Dashboard',
          path: '/admin/dashboard',
          icon: <LayoutDashboardIcon size={20} />,
        },
      ],
    },
    {
      title: 'Content Management',
      items: [
        {
          name: 'Animals',
          path: '/admin/animals',
          icon: <LeafIcon size={20} />,
          subItems: [
            {
              name: 'All Animals',
              path: '/admin/animals',
              icon: <ListIcon size={16} />,
            },
            {
              name: 'Add Animal',
              path: '/admin/animals/create',
              icon: <PlusCircleIcon size={16} />,
            },
          ],
        },
        {
          name: 'Quizzes',
          path: '/admin/quizzes',
          icon: <FileQuestionIcon size={20} />,
          subItems: [
            {
              name: 'All Quizzes',
              path: '/admin/quizzes',
              icon: <ListIcon size={16} />,
            },
            {
              name: 'Create Quiz',
              path: '/admin/quizzes/create',
              icon: <BookPlusIcon size={16} />,
            },
          ],
        },
        {
          name: 'Badges',
          path: '/admin/badges',
          icon: <AwardIcon size={20} />,
          subItems: [
            {
              name: 'All Badges',
              path: '/admin/badges',
              icon: <ListIcon size={16} />,
            },
            {
              name: 'Create Badge',
              path: '/admin/badges/create',
              icon: <PlusCircleIcon size={16} />,
            },
          ],
        },
      ],
    },
    {
      title: 'User Management',
      items: [
        {
          name: 'Users',
          path: '/admin/users',
          icon: <UsersIcon size={20} />,
          subItems: [
            {
              name: 'All Users',
              path: '/admin/users',
              icon: <ListIcon size={16} />,
            },
            {
              name: 'Add User',
              path: '/admin/users/create',
              icon: <UserPlusIcon size={16} />,
            },
          ],
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          name: 'Settings',
          path: '/admin/settings',
          icon: <SettingsIcon size={20} />,
        },
        {
          name: 'Help & Support',
          path: '/admin/help',
          icon: <HelpCircleIcon size={20} />,
        },
      ],
    },
  ];
  return <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ease-in-out" onClick={() => setIsOpen(false)} aria-hidden="true" />}
      {/* Sidebar */}
      <aside ref={sidebarRef} className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200 pt-20 transition-all duration-300 ease-in-out transform md:translate-x-0 ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Close button - Mobile only */}
          <div className="md:hidden absolute top-4 right-4">
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={() => setIsOpen(false)} aria-label="Close sidebar">
              <XIcon size={20} />
            </button>
          </div>
          {/* Admin profile section */}
          <div className="px-5 py-4">
            <div className="bg-indigo-50/70 rounded-xl p-4 border border-indigo-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  <ShieldIcon size={18} />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-800">
                    {userName}
                  </div>
                  <div className="text-xs text-gray-500">{userEmail}</div>
                </div>
              </div>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-20">
            {navGroups.map((group, groupIndex) => <div key={groupIndex} className="py-2">
                <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.title}
                </div>
                {group.items.map(item => <div key={item.path} className="mb-1">
                    {item.subItems ? <>
                        {/* Section with dropdown */}
                        <button className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isRouteActive(item.path, item.subItems) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => toggleSection(item.name)} aria-expanded={expandedSections[item.name]}>
                          <div className="flex items-center">
                            <span className={`mr-3 ${isRouteActive(item.path, item.subItems) ? 'text-indigo-600' : 'text-gray-500'}`}>
                              {item.icon}
                            </span>
                            {item.name}
                          </div>
                          <ChevronDownIcon size={16} className={`transition-transform duration-200 ${expandedSections[item.name] ? 'rotate-180' : ''}`} />
                        </button>
                        {/* Submenu items with animation */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections[item.name] ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="pl-10 mt-1 space-y-1">
                            {item.subItems.map(subItem => <NavLink key={subItem.path} to={subItem.path} className={({
                      isActive
                    }) => `flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${isActive ? 'bg-indigo-50/70 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900'}`} onClick={() => setIsOpen(false)}>
                                <span className="mr-2.5 text-current opacity-70">
                                  {subItem.icon}
                                </span>
                                {subItem.name}
                              </NavLink>)}
                          </div>
                        </div>
                      </> :
              // Regular nav item without dropdown
              <NavLink to={item.path} className={({
                isActive
              }) => `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setIsOpen(false)}>
                        <span className={`mr-3 ${location.pathname === item.path ? 'text-indigo-600' : 'text-gray-500'}`}>
                          {item.icon}
                        </span>
                        {item.name}
                      </NavLink>}
                  </div>)}
              </div>)}
          </nav>
          {/* Footer */}
          <div className="mt-auto border-t border-gray-200 p-4">
            <div className="flex items-center justify-between px-2 py-2 text-sm text-gray-600">
              <div>
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Wildlife Guardians</span>
                  <br />
                  <span className="text-gray-400">Admin v1.0</span>
                </p>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                <LogOutIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>;
};
export default AdminSidebar;