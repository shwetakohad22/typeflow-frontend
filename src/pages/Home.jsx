import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TypingTest from "../components/TypingTest";
import axios from "axios";
import { useGlobal } from "../context/GlobalContext";
import { Zap, Target, Clock } from "lucide-react";

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
    <div className="h-full flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Header Section */}
      <div className="text-center mb-8 space-y-2 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 tracking-tight">
          Test Your Speed
        </h1>
        <p className="text-lg text-gray-400 font-medium">
          Choose your settings and start typing
        </p>
      </div>

      {/* Control Panel */}
      <div className="mb-8 animate-fade-in animation-delay-100">
        <div className="bg-dark-card p-2 rounded-xl border border-white/5 flex flex-wrap justify-center gap-2 shadow-xl">
          {/* Duration Selector */}
          <div className="bg-dark p-1 rounded-lg flex items-center gap-1">
            {[15, 30, 60, 120].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  duration === d
                    ? "bg-primary text-dark shadow-sm"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                {d}s
              </button>
            ))}
          </div>

          <div className="w-px bg-white/10 my-1 mx-2"></div>

          {/* Difficulty Selector */}
          <div className="bg-dark p-1 rounded-lg flex items-center gap-1">
            {["easy", "medium", "hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                  difficulty === diff
                    ? "bg-primary text-dark shadow-sm"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Typing Test Component */}
      <div className="w-full max-w-5xl">
        <TypingTest
          key={`${duration}-${difficulty}`}
          duration={duration}
          difficulty={difficulty}
          onFinish={handleTestFinish}
          isLoggedIn={!!user}
          onSaveLogin={handleLoginSave}
        />
      </div>
    </div>
  );
};

export default Home;
