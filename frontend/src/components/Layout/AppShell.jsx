import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { BookOpen, LogOut, User } from 'lucide-react';

export function AppShell({ children, sidebar = null }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">LMS</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Subjects
              </Link>
              
              {user && (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sidebar ? (
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-80 flex-shrink-0">
              {sidebar}
            </aside>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
