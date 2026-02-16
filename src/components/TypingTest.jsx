import { useRef, useEffect, useState, useMemo } from "react";
import useTypingEngine from "../hooks/useTypingEngine";
import { RotateCcw, Volume2, VolumeX, Trophy, Zap, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const containerRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [caretPosition, setCaretPosition] = useState({ top: 0, left: 0 });
  const [containerWidth, setContainerWidth] = useState(0);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize(); // Initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sound Effect
  const playClickSound = () => {
    if (!soundEnabled) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    const randomDetune = Math.random() * 20 - 10;
    osc.frequency.setValueAtTime(600 + randomDetune, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  // Focus and Progress
  useEffect(() => {
    if (!isFinished) {
      inputRef.current?.focus();
    }
  }, [isFinished, isActive, duration, difficulty]);

  useEffect(() => {
    if (onProgress) {
      const progress = Math.min(
        100,
        Math.round((userInput.length / text.length) * 100)
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

  // Horizontal Scroll Logic
  // We calculate the left offset of the current character and shift the container
  // so the active character is always near the center (or slightly left/right as preferred).
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const charElements = containerRef.current.querySelectorAll("span.char");
      const currentIndex = userInput.length;

      let activeCharLeft = 0;
      let activeCharWidth = 0;

      if (charElements[currentIndex]) {
        activeCharLeft = charElements[currentIndex].offsetLeft;
        activeCharWidth = charElements[currentIndex].offsetWidth;
      } else if (currentIndex > 0 && charElements[currentIndex - 1]) {
        // End of text, use the position after last char
        const lastChar = charElements[currentIndex - 1];
        activeCharLeft = lastChar.offsetLeft + lastChar.offsetWidth;
        activeCharWidth = 20; // approximate width of cursor
      }

      // Calculate shift to keep active char in the middle
      // Center position = containerWidth / 2
      // Desired position of active char = activeCharLeft - scrollOffset
      // So: containerWidth / 2 = activeCharLeft - scrollOffset
      // scrollOffset = activeCharLeft - (containerWidth / 2) + (activeCharWidth / 2)

      // We start scrubbing when the user is gaining momentum, but let's keep it centered always for specific request.
      // Or maybe keep it a bit to the left (1/3 of screen) for better reading ahead.

      const targetOffset = activeCharLeft - (containerWidth / 2) + (activeCharWidth / 2);
      // Ensure we don't scroll into negative (start of text)
      // Actually, for "horizontal scrolling", negative offset is fine if we want center alignment from start?
      // But typically we want the start to be at left.
      // Let's settle for: only scroll if activeChar > center.

      // Simplified: always try to center the active character.
      // If activeCharLeft is small (start of text), offset might be negative (shifting text right).
      // We probably want to clamp it to minimum 0 (text starts at left edge) or maybe allow centering.
      // "One line only with scrolling effect" -> usually implies type-writer style or center focus.

      // Let's implement Typewriter style: User is fixed, text moves left.
      // Center the active character:
      setScrollOffset(activeCharLeft - containerWidth / 2);

      // Update Caret Position relative to the *scrolled* view?
      // No, caret is inside the scrolling container, so it moves with text?
      // OR caret is static overlay?
      // If we move the whole inner container, the caret should be inside it.

      setCaretPosition({
        left: activeCharLeft,
        top: 0, // In single line, top is always 0-ish (relative to line).
        height: 40 // adjustable
      });
    }
  }, [userInput, text, containerWidth]);

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      resetTest();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v")) {
      e.preventDefault();
    }
  };

  const renderText = () => {
    return text.split("").map((char, index) => {
      let className = "char relative transition-colors duration-100 ";
      if (index < userInput.length) {
        className +=
          userInput[index] === char
            ? "text-gray-900 dark:text-gray-100" // Correct (dark text on light, light on dark)
            : "text-danger bg-danger/10 rounded-sm"; // Incorrect
      } else {
        className += "text-gray-400 dark:text-gray-600"; // Untyped (muted)
      }

      return (
        <span key={index} className={className}>
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  };

  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto w-full"
      >
        <div className="glass-card p-10 border border-white/10 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <h2 className="text-4xl font-bold mb-10 text-white tracking-tight">Test Completed</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-dark/50 rounded-2xl flex flex-col items-center justify-center border border-white/5 hover:border-primary/30 transition-colors">
              <Zap className="w-8 h-8 text-primary mb-3" />
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">WPM</p>
              <p className="text-6xl font-black text-white">{wpm}</p>
            </div>
            <div className="p-6 bg-dark/50 rounded-2xl flex flex-col items-center justify-center border border-white/5 hover:border-primary/30 transition-colors">
              <Trophy className="w-8 h-8 text-accent mb-3" />
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Accuracy</p>
              <p className="text-6xl font-black text-white">{accuracy}%</p>
            </div>
            <div className="p-6 bg-dark/50 rounded-2xl flex flex-col items-center justify-center border border-white/5 hover:border-primary/30 transition-colors">
              <Target className="w-8 h-8 text-secondary mb-3" />
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">CPM</p>
              <p className="text-6xl font-black text-white">{cpm}</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={resetTest}
              className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl transition-all font-medium border border-white/5"
            >
              <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
              Try Again
            </button>
            {!isLoggedIn && (
              <button
                onClick={() => onSaveLogin({ wpm, accuracy, difficulty, duration })}
                className="flex items-center gap-2 bg-primary hover:bg-teal-400 text-dark px-8 py-3 rounded-xl transition-all font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40"
              >
                Sign in to Save
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className="w-full max-w-5xl mx-auto cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* HUD / Stats Bar */}
      <div className="flex justify-between items-center mb-4 px-4 text-gray-500 dark:text-gray-400 font-mono text-sm select-none">
        <div className="flex gap-8">
          <div className={`transition-all duration-300 ${timeLeft < 10 ? "text-danger animate-pulse" : "text-primary"}`}>
            <span className="text-xs uppercase tracking-wider opacity-70">Time:</span> <span className="font-bold text-xl">{timeLeft}</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider opacity-70">WPM:</span> <span className="font-bold text-xl text-gray-800 dark:text-gray-200">{wpm}</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider opacity-70">Acc:</span> <span className="font-bold text-xl text-gray-800 dark:text-gray-200">{accuracy}%</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setSoundEnabled(!soundEnabled);
          }}
          className="hover:text-primary transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      {/* Typing Area - Container for Masking */}
      <div
        className={`relative bg-transparent rounded-3xl border transition-all duration-300 h-[180px] flex items-center shadow-xl overflow-hidden
        ${isFocused ? "border-primary/30 shadow-primary/5" : "border-gray-200 dark:border-white/5"}
        ${!isFocused && "opacity-80"}
        `}
        style={{
          // Using inline style for glass effect to ensure it uses CSS vars correctly if not picked up by tailwind class immediately
          background: "var(--glass-bg)",
          borderColor: isFocused ? "var(--primary-color)" : "var(--glass-border)"
        }}
      >
        {/* Gradients for fading edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-dark-card/90 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-dark-card/90 to-transparent z-10 pointer-events-none"></div>

        {/* Focus Overlay */}
        <AnimatePresence>
          {!isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 dark:bg-dark/60 backdrop-blur-[2px] rounded-3xl cursor-pointer"
            >
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-card px-6 py-3 rounded-full border border-gray-200 dark:border-white/10 shadow-xl">
                <Zap className="w-5 h-5 text-primary animate-pulse" />
                <span className="font-medium">Click to focus</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrolling Content Wrapper */}
        <motion.div
          className="relative z-0 font-mono text-3xl md:text-4xl whitespace-nowrap will-change-transform flex items-center"
          animate={{ x: -scrollOffset }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
          style={{ paddingLeft: "50%" }} // Start at center? or handled by offset calculation?
        // If we use paddingLeft 50%, the 0th char starts at center.
        // Then scrollOffset = activeCharLeft.
        // Let's try explicit positioning logic instead of padding hacks if possible, 
        // or just use the calculated offset which assumes 0 start.
        // If we want the *first* char to start at the left, we clamp >= 0.
        // If we want typewriter (always center), we need virtual padding or offset math.
        // The math `setScrollOffset(activeCharLeft - containerWidth / 2)` attempts to center.
        // If activeCharLeft < containerWidth/2 (start of text), offset is negative.
        // A negative offset on `x` pushes it RIGHT.
        // So if `x = -(activeCharLeft - center)`, then `x = center - activeCharLeft`.
        // If activeCharLeft is 0, x = center. Text starts at center.
        // Correct.
        >
          <div ref={containerRef} className="flex items-center relative py-8">
            {/* Smooth Caret - Absolute relative to the TEXT FLOW, causing it to scroll WITH text */}
            {isFocused && isActive && (
              <motion.div
                layout
                animate={{
                  left: caretPosition.left
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 28
                }}
                className="absolute top-1/2 -translate-y-1/2 w-[3px] h-[1.2em] bg-primary rounded-full shadow-[0_0_15px_rgba(13,148,136,0.6)] z-20"
              />
            )}

            {renderText()}
          </div>
        </motion.div>

        <textarea
          ref={inputRef}
          value={userInput}
          onChange={(e) => processInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 opacity-0 cursor-default -z-10"
          autoFocus={!isFinished}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
        />
      </div>

      {/* Footer Controls */}
      <div className="flex justify-center mt-6 cursor-default">
        <button
          onClick={resetTest}
          className="text-gray-500 hover:text-white hover:bg-white/5 px-6 py-2 rounded-full transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-medium"
        >
          <RotateCcw className="w-4 h-4" /> Restart
        </button>
      </div>
    </div>
  );
};

export default TypingTest;
