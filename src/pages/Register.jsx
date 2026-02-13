import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobal } from "../context/GlobalContext";
import { Mail, Lock, User as UserIcon, AlertCircle } from "lucide-react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useGlobal();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register
      await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });

      // Auto login
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });
      setUser(res.data.user);
      localStorage.setItem("auth-token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-full px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-100 mb-2">
            Join TypeCraft
          </h2>
          <p className="text-gray-400">
            Create an account to track your progress
          </p>
        </div>

        <div className="bg-dark-card border border-white/5 rounded-2xl shadow-xl overflow-hidden animate-fade-in animation-delay-100">
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            <Link
              to="/login"
              className="flex-1 py-4 text-center text-sm font-bold text-gray-500 hover:text-gray-300 transition-all hover:bg-white/5"
            >
              Login
            </Link>
            <button className="flex-1 py-4 text-sm font-bold text-white bg-white/5 border-b-2 border-primary transition-all">
              Register
            </button>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  placeholder="Choose a username"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  placeholder="Create a strong password"
                  required
                  minLength={6}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Must be at least 6 characters
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-teal-400 text-dark font-bold py-3.5 rounded-lg transition-all shadow-lg transform active:scale-[0.98] mt-2"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
