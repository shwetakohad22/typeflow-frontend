import { useState, useEffect, useRef, useCallback } from "react";

const WORDS = [
  "the",
  "be",
  "of",
  "and",
  "a",
  "to",
  "in",
  "he",
  "have",
  "it",
  "that",
  "for",
  "they",
  "i",
  "with",
  "as",
  "not",
  "on",
  "she",
  "at",
  "by",
  "this",
  "we",
  "you",
  "do",
  "but",
  "from",
  "or",
  "which",
  "one",
  "would",
  "all",
  "will",
  "there",
  "say",
  "who",
  "make",
  "when",
  "can",
  "more",
  "if",
  "no",
  "man",
  "out",
  "other",
  "so",
  "what",
  "time",
  "up",
  "go",
  "about",
  "than",
  "into",
  "could",
  "state",
  "only",
  "new",
  "year",
  "some",
  "take",
  "come",
  "these",
  "know",
  "see",
  "use",
  "get",
  "like",
  "then",
  "first",
  "any",
  "work",
  "now",
  "may",
  "such",
  "give",
  "over",
  "think",
  "most",
  "even",
  "find",
  "day",
  "also",
  "after",
  "way",
  "many",
  "must",
  "look",
  "before",
  "great",
  "back",
  "through",
  "long",
  "where",
  "much",
  "should",
  "well",
  "people",
  "down",
  "own",
  "just",
  "because",
  "good",
  "each",
  "those",
  "feel",
  "seem",
  "how",
  "high",
  "too",
  "place",
  "little",
  "world",
  "very",
  "still",
  "nation",
  "hand",
  "old",
  "life",
  "tell",
  "write",
  "become",
  "here",
  "show",
  "house",
  "both",
  "between",
  "need",
  "mean",
  "call",
  "develop",
  "under",
  "last",
  "right",
  "move",
  "thing",
  "general",
  "school",
  "never",
  "same",
  "another",
  "begin",
  "while",
  "number",
  "part",
  "turn",
  "real",
  "leave",
  "might",
  "want",
  "point",
  "form",
  "off",
  "child",
  "few",
  "small",
  "since",
  "against",
  "ask",
  "late",
  "home",
  "interest",
  "large",
  "person",
  "end",
  "open",
  "public",
  "follow",
  "during",
  "present",
  "without",
  "again",
  "hold",
  "govern",
  "around",
  "possible",
  "head",
  "consider",
  "word",
  "program",
  "problem",
  "however",
  "lead",
  "system",
  "set",
  "order",
  "eye",
  "plan",
  "run",
  "keep",
  "face",
  "fact",
  "group",
  "play",
  "stand",
  "increase",
  "early",
  "course",
  "change",
  "help",
  "line",
];

const generateContent = (difficulty) => {
  if (difficulty === "easy") {
    // Random lowercase words, no punctuation
    let content = "";
    for (let i = 0; i < 15; i++) {
      const word = WORDS[Math.floor(Math.random() * WORDS.length)];
      content += (content ? " " : "") + word;
    }
    return content;
  }

  if (difficulty === "medium") {
    let content = "";
    for (let i = 0; i < 12; i++) {
      const word = WORDS[Math.floor(Math.random() * WORDS.length)];
      content += (content ? " " : "") + word;
    }
    return content;
  }

  if (difficulty === "hard") {
    // Random words but with punctuation and numbers and complex structures
    let content = "";
    for (let i = 0; i < 10; i++) {
      let word = WORDS[Math.floor(Math.random() * WORDS.length)];

      // Add random punctuation
      if (Math.random() > 0.8) word += ",";
      else if (Math.random() > 0.9) word += ".";

      content += (content ? " " : "") + word;
    }
    return content;
  }

  return "";
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
    let generatedText = "";

    // Initial buffer of text (e.g. 50 chars minimum, effectively fetching a few batches)
    while (generatedText.length < 100) {
      generatedText += (generatedText ? " " : "") + generateContent(difficulty);
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
      setText((prev) => prev + " " + generateContent(difficulty));
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
