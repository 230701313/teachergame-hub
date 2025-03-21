
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, GraduationCap, BookUser } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isTeacher, isStudent } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300 ${
        scrolled 
          ? 'glass shadow-md py-2' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xl font-bold text-primary"
        >
          <span className="text-2xl">QuizMaster</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {!user ? (
            <>
              <Link 
                to="/" 
                className={`font-medium transition-all hover:text-primary ${
                  location.pathname === '/' ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                Home
              </Link>
              <Link to="/login" className="ml-4">
                <Button size="sm" variant="ghost" className="rounded-full px-6 hover:bg-primary/10">
                  Login
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className={`font-medium transition-all hover:text-primary ${
                  location.pathname === '/dashboard' ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                Dashboard
              </Link>
              
              {isTeacher() && (
                <Link 
                  to="/quizzes/create" 
                  className={`font-medium transition-all hover:text-primary flex items-center gap-1.5 ${
                    location.pathname === '/quizzes/create' ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  <BookUser className="h-4 w-4" />
                  Create Quiz
                </Link>
              )}
              
              {isStudent() && (
                <Link 
                  to="/quizzes" 
                  className={`font-medium transition-all hover:text-primary flex items-center gap-1.5 ${
                    location.pathname === '/quizzes' ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  <GraduationCap className="h-4 w-4" />
                  My Quizzes
                </Link>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout} 
                className="text-foreground/80 hover:text-destructive flex items-center gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass shadow-lg animate-slide-down">
          <div className="px-4 py-6 space-y-4 flex flex-col items-center">
            {!user ? (
              <>
                <Link 
                  to="/" 
                  className={`w-full text-center py-2 font-medium transition-all hover:text-primary ${
                    location.pathname === '/' ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  Home
                </Link>
                <Link to="/login" className="w-full">
                  <Button variant="default" className="w-full rounded-full">
                    Login
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/dashboard" 
                  className={`w-full text-center py-2 font-medium transition-all hover:text-primary ${
                    location.pathname === '/dashboard' ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  Dashboard
                </Link>
                
                {isTeacher() && (
                  <Link 
                    to="/quizzes/create" 
                    className={`w-full text-center py-2 font-medium flex items-center justify-center gap-1.5 transition-all hover:text-primary ${
                      location.pathname === '/quizzes/create' ? 'text-primary' : 'text-foreground/80'
                    }`}
                  >
                    <BookUser className="h-4 w-4" />
                    Create Quiz
                  </Link>
                )}
                
                {isStudent() && (
                  <Link 
                    to="/quizzes" 
                    className={`w-full text-center py-2 font-medium flex items-center justify-center gap-1.5 transition-all hover:text-primary ${
                      location.pathname === '/quizzes' ? 'text-primary' : 'text-foreground/80'
                    }`}
                  >
                    <GraduationCap className="h-4 w-4" />
                    My Quizzes
                  </Link>
                )}
                
                <Button 
                  variant="ghost" 
                  onClick={logout} 
                  className="w-full mt-4 text-foreground/80 hover:text-destructive flex items-center justify-center gap-1.5"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
