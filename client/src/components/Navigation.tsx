import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoutMutation = trpc.auth.logout.useMutation();
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLocation('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo.jpg" alt="HumaneBio" className="h-10 w-10 rounded object-cover" />
            <span className="text-xl font-bold text-black hidden sm:inline">HumaneBio</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-all relative ${
                  isActive(item.path)
                    ? 'text-black'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-400 opacity-50 animate-pulse" />
                )}
              </a>
            ))}
          </div>

          {/* Right Side - Cart and Members */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart */}
            <a
              href="/cart"
              className={`text-sm font-medium transition-all relative ${
                isActive('/cart')
                  ? 'text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Cart
              {isActive('/cart') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-400 opacity-50 animate-pulse" />
              )}
            </a>

            {/* Members Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMembersOpen(!isMembersOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-900 transition-colors"
              >
                Members
                <ChevronDown className={`w-4 h-4 transition-transform ${isMembersOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMembersOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-black">{user.name || user.email}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                      <a
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMembersOpen(false)}
                      >
                        Dashboard
                      </a>
                      {user.role === 'admin' && (
                        <a
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsMembersOpen(false)}
                        >
                          Admin Panel
                        </a>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMembersOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors flex items-center gap-2 border-t border-gray-200"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <a
                        href={getLoginUrl()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMembersOpen(false)}
                      >
                        Login
                      </a>
                      <a
                        href={getLoginUrl()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-200"
                        onClick={() => setIsMembersOpen(false)}
                      >
                        Sign Up
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 mt-4 pt-4 pb-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/cart"
              className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cart
            </a>
            <div className="px-4 py-2 border-t border-gray-200 mt-2 pt-2">
              {isAuthenticated && user ? (
                <>
                  <a
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors mb-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                  {user.role === 'admin' && (
                    <a
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors mb-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </a>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href={getLoginUrl()}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors mb-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </a>
                  <a
                    href={getLoginUrl()}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
