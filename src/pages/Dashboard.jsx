import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobal } from "../context/GlobalContext";
import { Trophy, Zap, Target, Clock, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { user } = useGlobal();
  const [bestScore, setBestScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBest = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const res = await axios.get("/api/tests/best", {
          headers: { "x-auth-token": token },
        });
        setBestScore(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBest();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
        </div>
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-3xl opacity-30"></div>
            <h2 className="relative text-5xl md:text-6xl font-black">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500">
                Your Stats
              </span>
            </h2>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
            Track your progress and crush your records
          </p>
        </div>

        {/* Main Best Score Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative bg-slate-900 dark:bg-slate-800 rounded-3xl border-2 border-slate-700 dark:border-slate-600 p-8 shadow-2xl">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-wider text-slate-300">
                    Personal Best
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-600">
                    All-time record
                  </p>
                </div>
              </div>
              {bestScore?.date && (
                <div className="bg-slate-800 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 dark:border-slate-600">
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    {new Date(bestScore.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-8xl font-black text-white">
                {bestScore?.wpm || 0}
              </span>
              <div>
                <span className="text-3xl font-bold text-slate-400">WPM</span>
                <div className="flex items-center gap-1 text-emerald-500 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-bold">Peak Performance</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="group/stat relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-2xl transform hover:scale-105 transition-all">
                <div className="absolute inset-0 bg-black/10 group-hover/stat:bg-black/0 transition-colors"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-emerald-100" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                      Accuracy
                    </span>
                  </div>
                  <p className="text-4xl font-black text-white">
                    {bestScore?.accuracy || 0}%
                  </p>
                </div>
              </div>

              <div className="group/stat relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 p-5 rounded-2xl transform hover:scale-105 transition-all">
                <div className="absolute inset-0 bg-black/10 group-hover/stat:bg-black/0 transition-colors"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-purple-100" />
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-100">
                      Difficulty
                    </span>
                  </div>
                  <p className="text-4xl font-black text-white capitalize">
                    {bestScore?.difficulty || "-"}
                  </p>
                </div>
              </div>

              <div className="group/stat relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 p-5 rounded-2xl transform hover:scale-105 transition-all">
                <div className="absolute inset-0 bg-black/10 group-hover/stat:bg-black/0 transition-colors"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-cyan-100" />
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-100">
                      Duration
                    </span>
                  </div>
                  <p className="text-4xl font-black text-white">
                    {bestScore?.duration || 0}s
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Card */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-black text-white mb-2">
                Keep Pushing Your Limits!
              </h4>
              <p className="text-cyan-100 leading-relaxed">
                Every practice session makes you faster. Challenge yourself with
                harder difficulties and longer durations to reach new personal
                records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
