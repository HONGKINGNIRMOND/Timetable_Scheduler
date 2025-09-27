import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { TimetableGenerator } from './components/TimetableGenerator';
import { LogOut, Calendar, Settings, Users, BookOpen } from 'lucide-react';

function NavigationHeader() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('dashboard');

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">Academic Scheduler</span>
            </div>
            <nav className="flex space-x-6">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('generator')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 'generator' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Generate Timetable
              </button>
              <button
                onClick={() => setCurrentPage('manage')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 'manage' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Manage Data
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <div className="font-medium text-gray-900">{user?.name}</div>
              <div className="text-gray-500 capitalize">{user?.role}</div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Page Content */}
      <div>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'generator' && <TimetableGenerator />}
        {currentPage === 'manage' && (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <Settings size={48} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Management</h2>
              <p className="text-gray-600">
                This section would contain comprehensive forms to manage all academic data.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <NavigationHeader />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;