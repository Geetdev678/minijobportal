import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Job Posts', path: '/jobs', icon: '💼' },
    { label: 'Applicants', path: '/applicants', icon: '👥' },
    { label: 'Profile', path: '/profile', icon: '⚙️' },
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 flex flex-col`}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        {isOpen && <h1 className="text-xl font-bold">JPortal</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-700 rounded"
        >
          {isOpen ? '←' : '→'}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-6 py-3 flex items-center gap-4 transition-colors ${
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;