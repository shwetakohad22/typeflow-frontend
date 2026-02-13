import { Link } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import { Zap, User, LogOut, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { user, setUser, theme, toggleTheme } = useGlobal();

  const logout = () => {
    setUser(null);
    localStorage.setItem("auth-token", "");
  };

  return (
    <nav className="w-full z-50 bg-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>
            <span className="text-xl font-bold text-gray-200">TypeCraft</span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-200 font-medium transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>{user.username}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-all"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>

                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 transition-all font-medium"
                >
                  <LogOut className="w-4 h-4 rotate-180" />
                  <span>Sign In</span>
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
