import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GoalsPage from './pages/GoalsPage';
import ReviewsPage from './pages/ReviewsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import AuditLogsPage from './pages/AuditLogsPage';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  goals: 'Goal Management',
  approvals: 'Goal Approvals',
  reviews: 'Quarterly Reviews',
  analytics: 'Analytics & Insights',
  reports: 'Reports & Exports',
  auditlogs: 'Audit Logs',
};

const AppContent: React.FC = () => {
  const { currentUser } = useApp();
  const [activePage, setActivePage] = useState('dashboard');

  if (!currentUser) return <Login />;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        if (currentUser.role === 'employee') return <EmployeeDashboard />;
        if (currentUser.role === 'manager') return <ManagerDashboard />;
        if (currentUser.role === 'admin') return <AdminDashboard />;
        return null;
      case 'goals':
      case 'approvals':
        return <GoalsPage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'auditlogs':
        return <AuditLogsPage />;
      default:
        return <EmployeeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-64 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <Navbar pageTitle={pageTitles[activePage] || 'GoalFlow'} />

      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
