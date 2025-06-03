
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Video, Menu, Home, History, Settings, Plus, LogOut } from 'lucide-react';

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'New Job', href: '/new-job', icon: Plus },
    { name: 'History', href: '/history', icon: History },
    ...(isAdmin ? [{ name: 'Webhook Settings', href: '/settings/webhooks', icon: Settings }] : []),
  ];

  const isActive = (href: string) => location.pathname === href;

  const NavLinks = ({ className = '', onItemClick }: { className?: string; onItemClick?: () => void }) => (
    <nav className={className}>
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={onItemClick}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(item.href)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-4 w-4 mr-3" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Clickable Logo */}
          <Link to="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
            <Video className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold">VideoGen</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLinks className="flex space-x-1" />
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col h-full">
                  <Link to="/dashboard" className="flex items-center mb-8" onClick={() => setIsOpen(false)}>
                    <Video className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="text-lg font-bold">VideoGen</span>
                  </Link>
                  
                  <NavLinks 
                    className="flex flex-col space-y-2 flex-1" 
                    onItemClick={() => setIsOpen(false)}
                  />
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="text-sm text-gray-600 mb-4 px-3">{user.email}</div>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
