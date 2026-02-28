import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/clients', label: 'Clients', icon: '👥' },
  { to: '/projects', label: 'Projects', icon: '📁' },
  { to: '/invoices', label: 'Invoices', icon: '💸' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  return (
    <aside className="h-screen w-64 bg-white border-r flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 text-2xl font-bold text-blue-700 tracking-tight">ClientFlow</div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 transition font-medium ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t flex flex-col gap-2">
        <div className="text-sm text-gray-500">{user?.name} ({user?.role})</div>
        <button
          className="w-full py-2 px-3 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
