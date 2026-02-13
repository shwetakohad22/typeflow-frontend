import { useRef, useEffect, useState } from "react";
import useTypingEngine from "../hooks/useTypingEngine";
import { RotateCcw, Timer } from "lucide-react";

const TypingTest = ({
  duration = 60,
  difficulty = "medium",
  onFinish,
  onProgress,
  isLoggedIn,
  onSaveLogin,
  minWords = 50,
}) => {
  const {
    timeLeft,
    isActive,
    isFinished,
    text,
    userInput,
    wpm,
    cpm,
    accuracy,
    processInput,
    resetTest,
  } = useTypingEngine(duration, difficulty, minWords);

  const inputRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playClickSound = () => {
    if (!soundEnabled) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  };

  const [isFocused, setIsFocused] = useState(false);

  // Focus input on load, click, and when active
  useEffect(() => {
    if (!isFinished) {
      inputRef.current?.focus();
    }
  }, [isFinished, isActive, duration, difficulty]);

  // Report progress and play sound
  useEffect(() => {
    if (onProgress) {
      const progress = Math.min(
        100,
        Math.round((userInput.length / text.length) * 100),
      );
      onProgress({ progress, wpm, cpm });
    }
    if (userInput.length > 0) playClickSound();
  }, [userInput, wpm, cpm, text, onProgress]);

  useEffect(() => {
    if (isFinished && onFinish) {
      onFinish({ wpm, cpm, accuracy, difficulty });
    }
  }, [isFinished, onFinish, wpm, accuracy, difficulty]);

  const handleKeyDown = (e) => {
    // Disable copy/paste
    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v")) {
      e.preventDefault();
    }
  };

  const renderText = () => {
    return text.split("").map((char, index) => {
      let className = "text-gray-500 transition-colors duration-200";
      if (index < userInput.length) {
        className =
          userInput[index] === char
            ? "text-gray-200"
            : "text-red-500 bg-red-500/10";
      } else if (index === userInput.length) {
        className =
          "text-primary bg-primary/20 border-l-2 border-primary animate-pulse";
      }
      return (
        <span key={index} className={`${className} font-mono`}>
          {char}
        </span>
      );
    });
  };

  if (isFinished) {
    return (
      <div className="text-center animate-fade-in max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-white">Test Completed!</h2>
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-dark-card p-6 rounded-xl border border-white/5 flex flex-col items-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
              WPM
            </p>
            <p className="text-6xl font-black text-primary">{wpm}</p>
          </div>
          <div className="bg-dark-card p-6 rounded-xl border border-white/5 flex flex-col items-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
              CPM
            </p>
            <p className="text-6xl font-black text-gray-200">{cpm}</p>
          </div>
          <div className="bg-dark-card p-6 rounded-xl border border-white/5 flex flex-col items-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
              Accuracy
            </p>
            <p className="text-6xl font-black text-accent">{accuracy}%</p>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={resetTest}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-lg transition-all font-medium"
          >
            <RotateCcw className="w-5 h-5" /> Try Again
          </button>
          {!isLoggedIn && (
            <button
              onClick={() =>
                onSaveLogin({ wpm, accuracy, difficulty, duration })
              }
              className="flex items-center gap-2 bg-primary hover:bg-teal-400 text-dark px-8 py-3 rounded-lg transition-all font-bold"
            >
              Login to Save Score
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto p-4 cursor-text font-mono"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Stats Header */}
      <div className="flex justify-center items-end gap-12 mb-12 select-none">
        <div className="text-center">
          <div
            className={`text-4xl font-bold transition-colors ${timeLeft < 10 ? "text-danger" : "text-primary"}`}
          >
            {timeLeft}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            Time
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">{wpm}</div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            WPM
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-200">{accuracy}%</div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            Accuracy
          </div>
        </div>
      </div>

      {/* Typing Area */}
      <div className="relative bg-dark-card p-8 md:p-12 rounded-2xl border border-white/5 min-h-[250px] text-2xl md:text-3xl leading-relaxed break-words shadow-2xl transition-all duration-300 group focus-within:ring-2 focus-within:ring-primary/20">
        {!isFocused && (
          <div className="absolute inset-0 bg-dark/80 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-2xl transition-opacity">
            <div className="text-gray-300 flex items-center gap-2 animate-pulse font-sans">
              Click to focus
            </div>
          </div>
        )}

        <div className="relative z-0">{renderText()}</div>

        <textarea
          ref={inputRef}
          value={userInput}
          onChange={(e) => processInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 opacity-0 cursor-default z-20"
          autoFocus
          spellCheck={false}
          onPaste={(e) => e.preventDefault()}
        />
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-300 opacity-50 hover:opacity-100">
        <button
          onClick={resetTest}
          className="group flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors bg-dark-card/50 px-4 py-2 rounded-full border border-white/5"
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
          <span className="text-xs font-medium uppercase tracking-widest">
            Restart
          </span>
        </button>
      </div>

      <div className="fixed bottom-10 right-10 flex gap-2 opacity-50 hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSoundEnabled(!soundEnabled);
          }}
          className="p-3 bg-dark-card border border-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all shadow-lg"
        >
          {soundEnabled ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="19.07" y1="4.93" x2="19.07" y2="4.93"></line>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <line x1="19.07" y1="19.07" x2="19.07" y2="19.07"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default TypingTest;
