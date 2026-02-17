import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import { Zap, User, LogOut, Sun, Moon, Keyboard, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, setUser, theme, toggleTheme } = useGlobal();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    setUser(null);
    localStorage.setItem("auth-token", "");
    setMenuOpen(false);
  };

  return (
    <nav className="w-full z-50 animate-fade-in relative">
      <div className="glass border-b border-white/5 bg-opacity-70 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group"
            onClick={() => setMenuOpen(false)}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
              <Keyboard className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              Type<span className="text-primary">Flow</span>
            </span>
          </Link>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/5"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                    location.pathname === "/dashboard"
                      ? "bg-primary/10 dark:bg-white/10 text-primary dark:text-white"
                      : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{user.username}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2.5 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 text-gray-700 dark:text-white transition-all font-medium"
                >
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-full bg-primary hover:bg-teal-400 text-white dark:text-dark font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                >
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: Theme toggle + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-all"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-white/5 px-4 py-4 space-y-3 animate-fade-in">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-all font-medium"
                >
                  <User className="w-5 h-5" />
                  <span>{user.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-medium w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white font-medium transition-all border border-gray-200 dark:border-white/10"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white dark:text-dark font-bold transition-all shadow-lg shadow-primary/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
