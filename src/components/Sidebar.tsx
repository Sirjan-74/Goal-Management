import React from 'react';
import {
  LayoutDashboard, Target, ClipboardList, BarChart3,
  FileText, LogOut, ChevronRight, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = {
  employee: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'goals', label: 'My Goals', icon: Target },
    { id: 'reviews', label: 'Reviews', icon: ClipboardList },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ],
  manager: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'goals', label: 'Team Goals', icon: Target },
    { id: 'approvals', label: 'Approvals', icon: ClipboardList },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'goals', label: 'All Goals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'auditlogs', label: 'Audit Logs', icon: ClipboardList },
  ],
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { currentUser, logout } = useApp();
  if (!currentUser) return null;

  const items = navItems[currentUser.role];

  const roleBadgeColor = {
    employee: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    manager: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    admin: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
  }[currentUser.role];

  const roleLabel = {
    employee: 'Employee',
    manager: 'Manager',
    admin: 'Admin',
  }[currentUser.role];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-xl border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">GoalFlow</h1>
            <p className="text-gray-500 text-xs">Goal Management</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {currentUser.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{currentUser.name}</p>
            <p className="text-gray-400 text-xs truncate">{currentUser.department}</p>
          </div>
        </div>
        <div className="mt-2 px-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeColor}`}>
            {roleLabel}
          </span>
          <span className="text-xs text-gray-500 ml-2">{currentUser.employeeCode}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-3 mb-3">Navigation</p>
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/20 text-white border border-blue-500/20 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'} />
              <span className="flex-1 text-left">{label}</span>
              {isActive && <ChevronRight size={14} className="text-blue-400" />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
