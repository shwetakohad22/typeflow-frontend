import { useState, useEffect, useRef, useCallback } from "react";

const TEXT_SOURCES = {
  easy: [
    "the quick brown fox jumps over the lazy dog",
    "programming is the art of telling another human what you want the computer to do",
    "success is not final failure is not fatal it is the courage to continue that counts",
    "simple sentences are easy to type and good for practice",
    "coding is fun when you know how to type fast without looking at the keyboard",
    "javascript is a popular language for web development",
    "react makes building user interfaces simple and efficient",
    "practice makes perfect especially when learning a new skill",
    "always be coding and learning new things every day",
    "consistency is key to mastering touch typing",
  ],
  medium: [
    "The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what you want the computer to do.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "In the end, it's not the years in your life that count. It's the life in your years.",
    "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    "Technology is best when it brings people together. It is not a bug, it is a feature.",
  ],
  hard: [
    "Digital design is like painting, except the paint never dries. The computer was born to solve problems that did not exist before.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "First, solve the problem. Then, write the code. Experience is the name everyone gives to their mistakes.",
    "Java is to JavaScript what car is to Carpet. Knowledge is power.",
    "Optimism is an occupational hazard of programming: feedback is the treatment. Code is like humor. When you have to explain it, it's bad.",
  ],
};

const useTypingEngine = (duration = 60, difficulty = "medium") => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, total: 0 });

  const timerRef = useRef(null);

  const resetTest = useCallback(() => {
    const source = TEXT_SOURCES[difficulty] || TEXT_SOURCES.medium;
    let generatedText = "";

    // Initial buffer of text (e.g. 50 words)
    while (generatedText.split(" ").length < 50) {
      const randomSentence = source[Math.floor(Math.random() * source.length)];
      generatedText += (generatedText ? " " : "") + randomSentence;
    }

    setText(generatedText);
    setUserInput("");
    setTimeLeft(duration);
    setIsActive(false);
    setIsFinished(false);
    setWpm(0);
    setCpm(0);
    setAccuracy(100);
    setStats({ correct: 0, incorrect: 0, total: 0 });
    if (timerRef.current) clearInterval(timerRef.current);
  }, [duration, difficulty]);

  useEffect(() => {
    resetTest();
  }, [resetTest]);

  const startTimer = () => {
    setIsActive(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endTest = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setIsFinished(true);
  };

  const processInput = (value) => {
    if (!isActive && !isFinished) startTimer();
    if (isFinished) return;

    setUserInput(value);

    // Infinite Text Generation:
    // If user is within 50 characters of the end, append more text
    if (text.length - value.length < 50) {
      const source = TEXT_SOURCES[difficulty] || TEXT_SOURCES.medium;
      const randomSentence = source[Math.floor(Math.random() * source.length)];
      setText((prev) => prev + " " + randomSentence);
    }

    // Calculate stats in real-time
    let correct = 0;
    let incorrect = 0;
    const chars = value.split("");

    chars.forEach((char, index) => {
      if (char === text[index]) correct++;
      else incorrect++;
    });

    setStats({ correct, incorrect, total: value.length });

    // Calculate WPM: (Correct chars / 5) / (Time elapsed in minutes)
    const timeElapsed = duration - timeLeft;
    if (timeElapsed > 0) {
      const grossWPM = value.length / 5 / (timeElapsed / 60);
      const netWPM = (value.length - incorrect) / 5 / (timeElapsed / 60);
      setWpm(Math.max(0, Math.round(netWPM)));

      const currentCPM = (value.length - incorrect) / (timeElapsed / 60);
      setCpm(Math.max(0, Math.round(currentCPM)));
    }

    // Calculate Accuracy
    const acc = value.length > 0 ? (correct / value.length) * 100 : 100;
    setAccuracy(Math.round(acc));

    // Auto-finish logic removed for infinite mode, or only on time end
    // if (value.length >= text.length) endTest();
  };

  return {
    timeLeft,
    isActive,
    isFinished,
    text,
    userInput,
    wpm,
    cpm,
    accuracy,
    stats,
    processInput,
    resetTest,
  };
};

export default useTypingEngine;
