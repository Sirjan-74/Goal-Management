import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, X, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  pageTitle: string;
}

const typeColors = {
  approval: 'bg-emerald-500/20 text-emerald-400',
  rejection: 'bg-red-500/20 text-red-400',
  review: 'bg-blue-500/20 text-blue-400',
  reminder: 'bg-amber-500/20 text-amber-400',
  info: 'bg-purple-500/20 text-purple-400',
};

const typeIcons = {
  approval: '✅',
  rejection: '❌',
  review: '📋',
  reminder: '⏰',
  info: 'ℹ️',
};

const Navbar: React.FC<NavbarProps> = ({ pageTitle }) => {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-gray-900/80 backdrop-blur-xl border-b border-white/5 flex items-center px-6 z-30">
      {/* Page Title */}
      <div className="flex-1">
        <h2 className="text-white font-semibold text-lg">{pageTitle}</h2>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 mr-4 w-64">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search goals, reports..."
          className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
        />
      </div>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        >
          <Bell size={18} className="text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-12 w-96 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <h3 className="text-white font-semibold text-sm">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck size={12} />
                    Mark all read
                  </button>
                )}
                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {userNotifications.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-sm">No notifications</div>
              ) : (
                userNotifications.slice(0, 10).map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!notif.isRead ? 'bg-blue-500/5' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0 mt-0.5">{typeIcons[notif.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${!notif.isRead ? 'text-white' : 'text-gray-300'}`}>
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[notif.type]}`}>
                            {notif.type}
                          </span>
                          <span className="text-xs text-gray-500">{formatTime(notif.createdAt)}</span>
                        </div>
                      </div>
                      {!notif.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="ml-4 w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {currentUser?.avatar}
      </div>
    </header>
  );
};

export default Navbar;
