import { Link, useLocation } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import { Zap, User, LogOut, Sun, Moon, Keyboard } from "lucide-react";

const Navbar = () => {
  const { user, setUser, theme, toggleTheme } = useGlobal();
  const location = useLocation();

  const logout = () => {
    setUser(null);
    localStorage.setItem("auth-token", "");
  };

  return (
    <nav className="w-full z-50 animate-fade-in relative z-50">
      <div className="glass border-b border-white/5 bg-opacity-70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
              <Keyboard className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
              Type<span className="text-primary">Flow</span>
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/5"
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${location.pathname === "/dashboard"
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 text-gray-300 hover:text-white"
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
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-teal-400 text-dark font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                >
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
