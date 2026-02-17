import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TypingTest from "../components/TypingTest";
import axios from "axios";
import { useGlobal } from "../context/GlobalContext";
import { Zap, Target, Clock, Trophy, Settings } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const { user } = useGlobal();
  const navigate = useNavigate();
  const [duration, setDuration] = useState(60);
  const [difficulty, setDifficulty] = useState("medium");

  const handleTestFinish = async (results) => {
    console.log("Test Finished:", results);
    if (user) {
      try {
        const token = localStorage.getItem("auth-token");
        await axios.post(
          "/api/tests/save",
          { ...results, duration },
          {
            headers: { "x-auth-token": token },
          },
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLoginSave = (results) => {
    localStorage.setItem("pendingScore", JSON.stringify(results));
    navigate("/login");
  };

  return (
    <div className="h-screen max-h-screen flex flex-col relative overflow-hidden bg-dark transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-accent/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 flex-1 flex flex-col justify-center items-center h-full">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4 sm:mb-8 space-y-2"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] sm:text-[10px] font-medium text-primary mb-1 tracking-wide uppercase">
            Enhance Your Workflow
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight dark:text-white text-gray-900 drop-shadow-lg">
            Type<span className="text-primary">Flow</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Master the art of speed typing.
          </p>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4 sm:mb-8 w-full max-w-md"
        >
          <div className="glass rounded-full p-1.5 sm:p-2 flex flex-wrap justify-center sm:justify-between items-center gap-1 sm:gap-0 shadow-2xl">
            {/* Duration Selector */}
            <div className="flex gap-0.5 sm:gap-1 bg-black/10 dark:bg-black/20 rounded-full p-1">
              {[15, 30, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all duration-300 ${
                    duration === d
                      ? "bg-primary text-white shadow-lg scale-105" // text-white is explicit for active state
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/20"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Clock
                      size={12}
                      className={
                        duration === d
                          ? "opacity-100"
                          : "opacity-0 w-0 overflow-hidden transition-all"
                      }
                    />
                    {d}s
                  </span>
                </button>
              ))}
            </div>

            <div className="hidden sm:block h-4 w-px bg-gray-300 dark:bg-white/10 mx-2"></div>

            {/* Difficulty Selector */}
            <div className="flex gap-0.5 sm:gap-1 bg-black/10 dark:bg-black/20 rounded-full p-1">
              {["easy", "medium", "hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold capitalize transition-all duration-300 ${
                    difficulty === diff
                      ? "bg-primary text-white shadow-lg scale-105"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/20"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Target
                      size={12}
                      className={
                        difficulty === diff
                          ? "opacity-100"
                          : "opacity-0 w-0 overflow-hidden transition-all"
                      }
                    />
                    {diff}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Typing Test Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-5xl relative"
        >
          {/* Decorative blurs behind the card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl rounded-[3rem] -z-10"></div>

          <TypingTest
            key={`${duration}-${difficulty}`}
            duration={duration}
            difficulty={difficulty}
            onFinish={handleTestFinish}
            isLoggedIn={!!user}
            onSaveLogin={handleLoginSave}
          />
        </motion.div>
      </div>

      {/* Simple Footer/Info */}
      <footer className="py-4 text-center text-gray-500 text-xs absolute bottom-0 w-full">
        <p>
          Press{" "}
          <span className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-mono text-[10px]">
            Tab
          </span>{" "}
          to restart test
        </p>
      </footer>
    </div>
  );
};

export default Home;
