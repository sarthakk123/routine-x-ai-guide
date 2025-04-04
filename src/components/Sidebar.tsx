
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BarChart2, 
  Repeat, 
  User, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const routes = [
    {
      label: 'Home',
      icon: <Home className="mr-2 h-4 w-4" />,
      href: '/',
      active: location.pathname === '/',
    },
    {
      label: 'Dashboard',
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
      href: '/dashboard',
      active: location.pathname === '/dashboard',
    },
    {
      label: 'My Habits',
      icon: <Repeat className="mr-2 h-4 w-4" />,
      href: '/habits',
      active: location.pathname === '/habits',
    },
    {
      label: 'Profile',
      icon: <User className="mr-2 h-4 w-4" />,
      href: '/profile',
      active: location.pathname === '/profile',
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-routinex-bg border-r border-routinex-card">
      <div className="py-4 px-3">
        <h1 className="text-xl font-bold">RoutineX</h1>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {routes.map((route) => (
            <li key={route.href}>
              <Link
                to={route.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-routinex-card",
                  route.active ? "bg-routinex-card text-foreground" : "text-muted-foreground"
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-routinex-card py-4 px-2">
        <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-routinex-card transition-colors">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
