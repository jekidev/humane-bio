import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { getLoginUrl } from '@/const';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HB</span>
              </div>
              <span className="text-lg font-bold text-black hidden sm:inline">HumaneBio</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span className="text-gray-700 hover:text-black smooth-transition cursor-pointer font-medium">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="border-gray-300 text-black hover:bg-gray-100">
                    {user?.name || 'Dashboard'}
                  </Button>
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/admin">
                    <Button className="bg-black text-white hover:bg-gray-900">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  className="border-gray-300 text-black hover:bg-gray-100"
                  onClick={() => {
                    logout();
                    setLocation('/');
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-black text-white hover:bg-gray-900">
                  Sign In
                </Button>
              </a>
            )}
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
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className="px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-50 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </div>
              </Link>
            ))}
            <div className="px-4 py-2 border-t border-gray-200 mt-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full border-gray-300 text-black hover:bg-gray-100 mb-2">
                      Dashboard
                    </Button>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin">
                      <Button className="w-full bg-black text-white hover:bg-gray-900 mb-2">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-black hover:bg-gray-100"
                    onClick={() => {
                      logout();
                      setLocation('/');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <a href={getLoginUrl()} className="block">
                  <Button className="w-full bg-black text-white hover:bg-gray-900">
                    Sign In
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
