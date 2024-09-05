'use client'

import { useState, useEffect } from 'react'
import { Clock, Menu } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Sidebar from './Sidebar'
import Leaderboard from './LeaderBoard'
import HowToPlayModal from './HowToPlayModal'
import GameOverModal from './GameOverModal'

type GuessType = {
  word: string
  similarityScore: number
}

type LeaderboardEntry = {
  name: string
  score: number
}

export default function Game() {
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(true)
  const [guesses, setGuesses] = useState<GuessType[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [highestScore, setHighestScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds game time
  const [targetWord, setTargetWord] = useState('') // This would be set from your backend
  const [isGameOver, setIsGameOver] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { name: "Alice", score: 950 },
    { name: "Bob", score: 920 },
    { name: "Charlie", score: 880 },
    { name: "David", score: 850 },
    { name: "Eve", score: 820 },
  ])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (!isHowToPlayOpen && timeLeft > 0 && !isGameOver) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsGameOver(true)
    }
    return () => clearInterval(timer)
  }, [timeLeft, isHowToPlayOpen, isGameOver])

  useEffect(() => {
    if (!isHowToPlayOpen) {
      // Here you would fetch the target word from your backend
      setTargetWord('example') // Placeholder
    }
  }, [isHowToPlayOpen])

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentGuess.trim() === '') return // Prevent empty guesses
    // This is where you'd integrate with Pinecone and LangChain to get the actual similarity score
    const similarityScore = Math.floor(Math.random() * 1001) // Placeholder: random score between 0 and 1000
    const newGuess = { word: currentGuess, similarityScore }
    setGuesses((prevGuesses) => [newGuess, ...prevGuesses.slice(0, 4)]) // Keep only the last 5 guesses
    setCurrentGuess('')
    if (similarityScore > highestScore) {
      setHighestScore(similarityScore)
    }
    if (similarityScore === 1000) {
      setIsGameOver(true)
    }
  }

  const getTemperatureColor = (score: number) => {
    if (score < 250) return 'bg-blue-500'
    if (score < 500) return 'bg-yellow-500'
    if (score < 750) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const resetGame = () => {
    setGuesses([])
    setHighestScore(0)
    setTimeLeft(60)
    setIsGameOver(false)
    setIsHowToPlayOpen(true)
    setTargetWord('') // This should fetch a new word from your backend when the game starts
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* User Profile and Mobile Menu */}
      <div className="bg-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 lg:hidden">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <Sidebar isMobile={true} />
                <Leaderboard leaderboard={leaderboard} isMobile={true} />
              </nav>
            </SheetContent>
          </Sheet>
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Main game area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hints and Legend (hidden on mobile) */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Game content */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Termostat</h1>
              <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-semibold">{timeLeft}s</span>
              </div>
            </div>

            {/* Thermometer */}
            <div className="mb-4 relative h-8 bg-gray-300 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-500 ease-in-out ${getTemperatureColor(highestScore)}`}
                style={{ width: `${(highestScore / 1000) * 100}%` }}
              ></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-sm font-bold">{highestScore}</span>
              </div>
            </div>
            
            <div className="flex-grow flex flex-col">
              {/* Guess input */}
              <form onSubmit={handleGuess} className="mb-4">
                <div className="flex">
                  <input
                    type="text"
                    value={currentGuess}
                    onChange={(e) => setCurrentGuess(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your guess..."
                    disabled={isGameOver}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
                    disabled={isGameOver}
                  >
                    Guess
                  </button>
                </div>
              </form>

              {/* Previous guesses */}
              <div className="flex-grow overflow-auto">
                <h3 className="text-lg font-semibold mb-2">Previous Guesses:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {guesses.map((guess, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                      <span className="font-medium">{guess.word}</span>
                      <span className={`px-3 py-1 rounded-full text-white text-sm ${getTemperatureColor(guess.similarityScore)}`}>
                        {guess.similarityScore}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard (hidden on mobile) */}
        <div className="hidden lg:block">
          <Leaderboard leaderboard={leaderboard} />
        </div>
      </div>

      {/* How to Play Modal */}
      {isHowToPlayOpen && (
        <HowToPlayModal
          onClose={() => setIsHowToPlayOpen(false)}
          onStartGame={() => setIsHowToPlayOpen(false)}
        />
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
  )
}