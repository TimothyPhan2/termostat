import { Button } from "./ui/button"
import { X } from "lucide-react"

type GameOverModalProps = {
  highestScore: number
  targetWord: string
  onResetGame: () => void
  onClose: () => void
}

export default function GameOverModal({ highestScore, targetWord, onResetGame, onClose }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 p-8 rounded-lg shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl">
            {highestScore === 1000 ? "You Win!" : "Game Over!"}
          </h2>
        </div>
        <p className="mb-4">
          {highestScore === 1000 ? (
            "Congratulations! You've guessed the word!"
          ) : (
            <>
              Time's up! The target word was "<span>{targetWord}</span> "
            </>
          )}
        </p>
        <p className="mb-6">Your highest similarity score: <span className="">{highestScore}</span></p>
        <Button
          onClick={onResetGame}
          className="w-full px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Play Again
        </Button>
      </div>
    </div>
  )
}