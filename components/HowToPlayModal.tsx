

type HowToPlayModalProps = {
  onStartGame: () => void
}

export default function HowToPlayModal({ onStartGame }: HowToPlayModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">How to Play</h2>
     
        </div>
        <div className="mb-6">
          <p className="mb-2">1. You have 60 seconds to guess the target word.</p>
          <p className="mb-2">2. Enter words that you think are related to the target word.</p>
          <p className="mb-2">3. Each guess will receive a similarity score from 0 to 1000.</p>
          <p className="mb-2">4. The color and position of the thermometer indicate how close you are.</p>
          <p className="mb-2">5. Try to achieve the highest similarity score possible!</p>
        </div>
        <button
          onClick={onStartGame}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Start Game
        </button>
      </div>
    </div>
  )
}