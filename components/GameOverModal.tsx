import { X } from 'lucide-react'

type GameOverModalProps = {
  highestScore: number
  targetWord: string
  onResetGame: () => void
}

export default function GameOverModal({ highestScore, targetWord, onResetGame }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Game Over!</h2>
          <button onClick={onResetGame} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="mb-4">
          {highestScore === 1000
            ? "Congratulations! You've guessed the word!"
            : `Time's up! The target word was "${targetWord}".`}
        </p>
        <p className="mb-6">Your highest similarity score: <span className="font-bold">{highestScore}</span></p>
        <button
          onClick={onResetGame}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}