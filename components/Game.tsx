"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Clock, Flame, Loader2 } from "lucide-react";
import GameOverModal from "./GameOverModal";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import GiveUpButton from "./GiveUpButton";
import { UserButton, useUser } from "@clerk/nextjs";
import "../styles/game.css";
import "../styles/fonts.css";

type GuessType = {
  word: string;
  similarityScore: number;
};

const GAME_DURATION = 600;

export default function Game() {
  const [guesses, setGuesses] = useState<GuessType[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [highestScore, setHighestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targetWord, setTargetWord] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [playAgain, setPlayAgain] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [visibleHints, setVisibleHints] = useState<boolean[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showNotRecognized, setShowNotRecognized] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isGameStarted && timeLeft > 0 && !isGameOver) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isGameStarted, isGameOver]);

  const fetchStreak = useCallback(async () => {
    if (!isSignedIn || !user) return;
    try {
      const response = await fetch(`/api/getStreak?userId=${user?.id}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
      const data = await response.json();
      setStreak(data[0].streak);
    } catch (error) {
      console.log(error);
    }
  }, [isSignedIn, user]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const fetchWord = useCallback(async () => {
    try {
      const response = await fetch(`/api/targetWord/${Date.now()}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
      const data = await response.json();
      setTargetWord(data.targetWord);
      setHints([data.hints.hint1, data.hints.hint2, data.hints.hint3]);
      setVisibleHints(new Array(3).fill(false));
      setPlayAgain(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (playAgain) {
      fetchWord();
      setPlayAgain(false);
    }
  }, [setPlayAgain, playAgain, fetchWord]);

  useEffect(() => {
    if (isGameStarted && !targetWord) {
      fetchWord();
    }
  }, [isGameStarted, targetWord, fetchWord]);

  const handleGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentGuess.trim() === "") return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/game`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Expires": "0",
        },
        body: JSON.stringify({
          targetWord: targetWord,
          userGuess: currentGuess.toLowerCase(),
        }),
      });
      if (!res.ok) {
        throw new Error(`API call failed with status ${res.status}`);
      }
      const data = await res.json();
      const similarityScore = data.similarityScore;
      setCurrentScore(similarityScore);

      if (similarityScore === 0) {
        setShowNotRecognized(true);
        setTimeout(() => setShowNotRecognized(false), 3000);
      } else {
        const newGuess = { word: currentGuess.toLowerCase(), similarityScore: similarityScore };
        setGuesses((prevGuesses) => {
          const updatedGuesses = prevGuesses.filter(guess => guess.word !== newGuess.word);
          return [...updatedGuesses, newGuess]
            .sort((a, b) => b.similarityScore - a.similarityScore);
        });
        setHasGuessed(true);
        if (similarityScore > highestScore) {
          setHighestScore(similarityScore);
        }
        if (similarityScore === 1000) {
          setIsGameOver(true);
          setStreak((prevStreak) => prevStreak + 1);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setCurrentGuess("");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  };

  const getTemperatureColor = (score: number) => {
    if (score < 350) return "bg-blue-700";
    if (score < 550) return "bg-purple-600";
    if (score < 800) return "bg-orange-500";
    return "bg-red-500";
  };

  const resetGame = () => {
    setGuesses([]);
    setHighestScore(0);
    setTimeLeft(GAME_DURATION);
    setIsGameOver(false);
    setTargetWord("");
    setPlayAgain(true);
    setHasGuessed(false);
    setHints([]);
    setCurrentGuess("");
    setCurrentScore(0);
    setVisibleHints(new Array(3).fill(false));
    setIsGameStarted(false);
  };

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const handleGiveUp = () => {
    setIsGameOver(true);
  };

  const handleGameOver = useCallback(async () => {
    if (isSignedIn && user) {
      const newStreak = highestScore === 1000 ? streak : 0;
      await fetch("/api/saveUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Expires": "0",
        },
        body: JSON.stringify({
          user_id: user.id,
          streak: newStreak,
        }),
      });

      await fetch("/api/saveLeaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Expires": "0",
        },
        body: JSON.stringify({
          user_id: user.id,
          score: highestScore,
          gamesWon: highestScore === 1000 ? 1 : 0,
        }),
      });

      if (highestScore !== 1000) {
        setStreak(0);
      }
    }
  }, [isSignedIn, user, streak, highestScore]);

  useEffect(() => {
    if (isGameOver) {
      handleGameOver();
    }
  }, [isGameOver, handleGameOver]);

  const toggleHint = (index: number) => {
    if (!isGameStarted) return;
    setVisibleHints(prev => {
      const newVisibleHints = [...prev];
      newVisibleHints[index] = !newVisibleHints[index];
      return newVisibleHints;
    });
  };

  const startGame = () => {
    setIsGameStarted(true);
    fetchWord();
  };

  const closeGameOverModal = () => {
    setIsGameOver(false);
    resetGame();
  };

  return (
    <div className="flex flex-col min-h-screen text-white">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 shadow-sm relative">
        <Link href="/" className="flex items-center justify-center">
          <span className="ml-2 text-2xl text-white">Termometer</span>
        </Link>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-700 via-white to-red-700"></div>
        <div className="flex-1 flex justify-end items-center space-x-4">
          {isSignedIn && (
            <>
              <Link href="/leaderboard" className="text-white">
                Leaderboard
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </header>

      <main className="flex-1 flex px-4 py-8">
        <div className="w-1/5 pr-4">
          <div className="">
            {!isGameStarted ? (
              <Button
                onClick={startGame}
                className="w-full bg-blue-700 hover:bg-blue-800 text-lg py-6"
              >
                Start Game
              </Button>
            ) : (
              <GiveUpButton onGiveUp={handleGiveUp} isGameActive={!isGameOver && timeLeft > 0} />
            )}
          </div>
          <div className="mt-4 mb-4 bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 text-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg mb-2">Game Stats</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center bg-black px-3 py-1 rounded-full">
                  <Flame className="h-4 w-4 mr-2" />
                  <span>Streak: {streak}</span>
                </div>
                <div className="flex items-center bg-blue-700 px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 text-gray-800 rounded-lg shadow-lg p-4 sticky top-8">
            <h3 className="text-lg mb-2 text-white">Hints:</h3>
            <div className="grid grid-cols-1 gap-1">
              {['Theme', 'Part of Speech', 'Letters'].map((hintType, index) => (
                <div
                  key={index}
                  className={`bg-gray-100 rounded-lg cursor-pointer transition-transform duration-300 ${visibleHints[index] ? 'rotate-y-180' : ''
                    } ${!isGameStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => toggleHint(index)}
                  style={{ height: '50px' }}
                >
                  <div className="h-full flex items-center justify-center">
                    {visibleHints[index] ? (
                      <p className="text-s p-1 rotate-y-180">{hints[index]}</p>
                    ) : (
                      <span className="text-lg">{hintType}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 text-gray-800 rounded-lg shadow-lg p-4">
            <h3 className="text-lg text-white mb-2">Score Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center text-white">
                <div className="w-16 h-4 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">800-1000: Hot</span>
              </div>
              <div className="flex items-center text-white">
                <div className="w-14 h-4 rounded-full bg-orange-500 mr-2"></div>
                <span className="text-sm">550-799: Warm</span>
              </div>
              <div className="flex items-center text-white">
                <div className="w-10 h-4 rounded-full bg-purple-600 mr-2"></div>
                <span className="text-sm">350-549: Cold</span>
              </div>
              <div className="flex items-center text-white">
                <div className="w-6 h-4 rounded-full bg-blue-700 mr-2"></div>
                <span className="text-sm">0-349: Very Cold</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-4/5">
          <div className="w-full bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 text-gray-800 rounded-lg shadow-lg p-8 min-h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex justify-center items-center mb-6">
              <h1 className="text-7xl text-white text-center">Termometer</h1>
            </div>

            <div className="mb-6 relative h-12 bg-gray-300 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-500 ease-in-out ${getTemperatureColor(currentScore)}`}
                style={{ width: `${(currentScore / 1000) * 100}%` }}
              ></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-lg text-black">{currentScore}</span>
              </div>
            </div>

            <form onSubmit={handleGuess} className="mb-6">
              <div className="flex">
                <Input
                  type="text"
                  value={currentGuess}
                  onChange={(e) => setCurrentGuess(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleGuess(e);
                    }
                  }}
                  className="rounded-r-none text-lg py-6 text-white"
                  placeholder="Enter your guess..."
                  disabled={!isGameStarted || isGameOver || isLoading}
                  ref={inputRef}
                />
                <Button
                  type="submit"
                  variant="default"
                  className="rounded-l-none bg-blue-700 hover:bg-blue-800 text-lg py-6 px-10"
                  disabled={!isGameStarted || isGameOver || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Guess"
                  )}
                </Button>
              </div>
            </form>

            <div className="flex-grow overflow-hidden">
              <div className="flex items-center mb-4">
                <h3 className="text-xl text-white">Previous Guesses: <span className="bg-neutral-300 text-black text-s rounded-full px-2 py-.5">
                  {guesses.length}
                </span></h3>
                {showNotRecognized && (
                  <span className="ml-4 text-red-300 animate-fade-out">
                    Word not recognized
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2 h-[calc(100%-2rem)] overflow-y-auto">
                <div className="h-[40rem] sm:h-[28rem] overflow-y-auto">
                  {guesses.map((guess, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded mb-2"
                    >
                      <span className="font-medium text-me">{guess.word}</span>
                      <span
                        className={`px-4 py-1 rounded-full text-white text-me ${getTemperatureColor(
                          guess.similarityScore
                        )}`}
                      >
                        {guess.similarityScore}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isGameOver && (
        <GameOverModal
          highestScore={highestScore}
          targetWord={targetWord}
          onResetGame={() => {
            resetGame();
            startGame();
          }}
          onClose={closeGameOverModal}
        />
      )}
    </div>
  );
}