"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, Flame, Loader2, Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

import HowToPlayModal from "./HowToPlayModal";
import GameOverModal from "./GameOverModal";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import GiveUpButton from "./GiveUpButton";

type GuessType = {
  word: string;
  similarityScore: number;
};
const GAME_DURATION = 600;
export default function Game() {
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(true);
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
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (!isHowToPlayOpen && timeLeft > 0 && !isGameOver) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
      setStreak(0);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isHowToPlayOpen, isGameOver]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  const fetchWord = useCallback(async () => {
    try {
      const response = await fetch("/api/targetWord");
      const data = await response.json();
    
      setTargetWord(data.targetWord);
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
  }, [setPlayAgain, playAgain]);

  useEffect(() => {
    if (!isHowToPlayOpen && !targetWord) {
      setPlayAgain(true);
    }
  }, [isHowToPlayOpen, targetWord]);

  const handleGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentGuess.trim() === "") return; // Prevent empty guesses

    setIsLoading(true);
    try {
      const res = await fetch("/api/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetWord: targetWord,
          userGuess: currentGuess,
        }),
      });
      if (!res.ok) {
        throw new Error(`API call failed with status ${res.status}`);
      }
      const data = await res.json();

  
      const parsedData = JSON.parse(data.answer);
      setHints([
        parsedData.hints.hint1,
        parsedData.hints.hint2,
        parsedData.hints.hint3,
      ]);
   
      const similarityScore = parsedData.similarityScore;
      setCurrentScore(similarityScore);
  
      const newGuess = { word: currentGuess, similarityScore: similarityScore };
      setGuesses((prevGuesses) => {
        return [...prevGuesses, newGuess]
          .sort((a, b) => b.similarityScore - a.similarityScore)
          .slice(0, 10);
      });
      setCurrentGuess("");
      setHasGuessed(true);
      if (similarityScore > highestScore) {
        setHighestScore(similarityScore);
      }
      if (similarityScore === 1000) {
        setIsGameOver(true);

        setStreak((prevStreak) => prevStreak + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTemperatureColor = (score: number) => {
    if (score < 350) return "bg-blue-500";
    if (score < 550) return "bg-purple-600";
    if (score < 750) return "bg-orange-500";
    return "bg-red-500";
  };

  const resetGame = () => {
    setGuesses([]);
    setHighestScore(0);
    setTimeLeft(GAME_DURATION);
    setIsGameOver(false);
    setIsHowToPlayOpen(false);
    setTargetWord("");
    setPlayAgain(true);
    setHasGuessed(false);
    setHints([]);
    setCurrentGuess("");
    setCurrentScore(0);
  };
  const { user, isSignedIn, isLoaded } = useUser();

  const handleGiveUp = () => {
    setIsGameOver(true);
  }
  const handleGameOver = async () => {
    if (user && isSignedIn && isLoaded) {
      await fetch("/api/saveUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          name: user.fullName,
          profile_pic: user.imageUrl,
          streak: streak,
        }),
      });

      await fetch("/api/saveLeaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          score: highestScore,
          gamesWon: highestScore === 1000 ? 1 : 0,
        }),
      });
    }
  };

  useEffect(() => {
    if (isGameOver) {
      handleGameOver();
    }
  }, [isGameOver]);
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* User Profile and Mobile Menu */}
      <div className="bg-white p-4 shadow-lg">
        <div className=" flex justify-between items-center">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 lg:hidden">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          
              <nav className="flex flex-col space-y-4">
                <Sidebar
                  isMobile={true}
                  hints={hints}
                  hasGuessed={hasGuessed}
                />
              </nav>
            </SheetContent>
          </Sheet>
          {user && isSignedIn && isLoaded && (
            <div className="flex-1 flex justify-end items-center space-x-4">
              <UserButton />
              <Link href={"/leaderboard"}>
                <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Leaderboard
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main game area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hints and Legend (hidden on mobile) */}
        <div className="hidden lg:block">
          <Sidebar isMobile={false} hints={hints} hasGuessed={hasGuessed} />
        </div>

        {/* Game content */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Termometer</h1>
              <div className="flex gap-5">
                <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="font-semibold">{formatTime(timeLeft)}</span>
                </div>
                <div className="flex items-center bg-red-100 px-3 py-1 rounded-full">
                  <Flame className="h-4 w-4 mr-2" />
                  <span className="font-semibold">Streak: {streak}</span>
                </div>
                <GiveUpButton onGiveUp={handleGiveUp} isGameActive={!isGameOver && timeLeft > 0} />
              </div>
            </div>

            {/* Thermometer */}
            <div className="mb-4 relative h-8 bg-gray-300 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-500 ease-in-out ${getTemperatureColor(
                  currentScore
                )}`}
                style={{ width: `${(currentScore / 1000) * 100}%` }}
              ></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-sm font-bold">{currentScore}</span>
              </div>
            </div>

            <div className="flex-grow flex flex-col">
              {/* Guess input */}
              <form onSubmit={handleGuess} className="mb-4">
                <div className="flex">
                  <Input
                    type="text"
                    value={currentGuess}
                    onChange={(e) => setCurrentGuess(e.target.value)}
                    className="rounded-r-none"
                    placeholder="Enter your guess..."
                    disabled={isGameOver || isLoading}
                  />
                  <Button
                    type="submit"
                    variant="default"
                    className="rounded-l-none"
                    disabled={isGameOver || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      "Guess"
                    )}
                  </Button>
                </div>
              </form>

              {/* Previous guesses */}
              <div className="flex-grow overflow-auto">
                <h3 className="text-lg font-semibold mb-2">
                  Previous Guesses:
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {guesses.map((guess, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-100 rounded"
                    >
                      <span className="font-medium">{guess.word}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${getTemperatureColor(
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
      </div>

      {/* How to Play Modal */}
      {isHowToPlayOpen && (
        <HowToPlayModal onStartGame={() => setIsHowToPlayOpen(false)} />
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <GameOverModal
          highestScore={highestScore}
          targetWord={targetWord}
          onResetGame={resetGame}
        />
      )}
    </div>
  );
}
