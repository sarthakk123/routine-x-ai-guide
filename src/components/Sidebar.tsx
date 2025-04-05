
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Sidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-16 md:w-64 bg-sidebar-background border-r border-sidebar-border h-screen flex flex-col">
      <div className="p-4 flex items-center justify-center md:justify-start">
        <h1 className="text-xl font-bold text-sidebar-primary hidden md:block">RoutineX</h1>
        <span className="text-xl font-bold text-sidebar-primary md:hidden">RX</span>
      </div>
      
      <nav className="flex-grow mt-8">
        <ul className="space-y-1 px-2">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center p-2 rounded-md transition-colors ${
                isActive('/dashboard')
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Home size={20} className="min-w-5" />
              <span className="ml-3 hidden md:inline">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/habits"
              className={`flex items-center p-2 rounded-md transition-colors ${
                isActive('/habits')
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Calendar size={20} className="min-w-5" />
              <span className="ml-3 hidden md:inline">Habits</span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`flex items-center p-2 rounded-md transition-colors ${
                isActive('/profile')
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <User size={20} className="min-w-5" />
              <span className="ml-3 hidden md:inline">Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <LogOut size={20} className="min-w-5" />
          <span className="ml-3 hidden md:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
