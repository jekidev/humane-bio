import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { getLoginUrl } from '@/const';
import { Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-30 border-b border-cyan-500/20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-600 to-cyan-500 group-hover:from-cyan-500 group-hover:to-cyan-400 transition-all">
            <div className="w-6 h-6 text-white font-bold flex items-center justify-center">HB</div>
          </div>
          <span className="text-xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">HumaneBio</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-300 hover:text-cyan-300 transition-colors font-medium">
            Home
          </Link>
          <Link href="/products" className="text-gray-300 hover:text-cyan-300 transition-colors font-medium">
            Products
          </Link>
          <Link href="/blog" className="text-gray-300 hover:text-cyan-300 transition-colors font-medium">
            Blog
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-cyan-300 transition-colors font-medium">
            About
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-cyan-300 transition-colors font-medium">
            Contact
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <Link href="/dashboard" className="text-gray-300 hover:text-cyan-300 transition-colors font-medium">
                Dashboard
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                onClick={() => logout()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-900 font-semibold"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-slate-800 rounded transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-cyan-500/20 bg-slate-900/95 backdrop-blur">
          <div className="container py-4 space-y-3">
            <Link href="/" className="block px-4 py-2 text-gray-300 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors">
              Home
            </Link>
            <Link href="/products" className="block px-4 py-2 text-gray-300 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors">
              Products
            </Link>
            <Link href="/blog" className="block px-4 py-2 text-gray-300 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors">
              Blog
            </Link>
            <Link href="/about" className="block px-4 py-2 text-gray-300 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors">
              About
            </Link>
            <Link href="/contact" className="block px-4 py-2 text-gray-300 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors">
              Contact
            </Link>
            <div className="pt-3 border-t border-slate-700 space-y-2">
              {isAuthenticated && user ? (
                <>
                  <Link href="/dashboard" className="block px-4 py-2 text-gray-300 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors">
                    Dashboard
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    onClick={() => logout()}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-900 font-semibold"
                  onClick={() => window.location.href = getLoginUrl()}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
