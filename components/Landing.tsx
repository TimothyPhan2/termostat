"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, Clock, Brain, Trophy, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import "../styles/landing.css";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-white">{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isOpen && <p className="mt-2 text-gray-300">{answer}</p>}
    </div>
  )
}

const AnimatedThermometer = () => {
  const [currentScore, setCurrentScore] = useState(0)
  const [currentWord, setCurrentWord] = useState("")
  const words = ["cold", "sour", "hot", "fridge", "pepper", "pan", "computer", "icy", "mountain", "suitcase"]

  useEffect(() => {
    const interval = setInterval(() => {
      const newWord = words[Math.floor(Math.random() * words.length)]
      setCurrentWord(newWord)
      setCurrentScore(Math.floor(Math.random() * 1000))
    }, 2000)

    return () => clearInterval(interval)
  }, [words])

  const getTemperatureColor = (score: number) => {
    if (score < 350) return "bg-blue-700"
    if (score < 550) return "bg-purple-600"
    if (score < 750) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-2 text-2xl customFont text-white">{currentWord}</div>
      <div className="mb-4 relative h-8 bg-gray-300 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-500 ease-in-out ${getTemperatureColor(currentScore)}`}
          style={{ width: `${(currentScore / 1000) * 100}%` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-sm customFont text-black">{currentScore}</span>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const faqItems = [
    {
      question: "What is Termometer?",
      answer: "Termometer is a word association game that challenges players to guess a secret word based on a temperature score for each guess."
    },
    {
      question: "How do I play?",
      answer: "Enter your guesses in the input field. The termometer will fluctuate and give you a score based on how close your guessed word is. Use this feedback to refine your guesses and try to guess the word before time runs out!"
    },
    {
      question: "Is there a time limit?",
      answer: "Yes, each game has a time limit of 10 minutes. The game is over once you run out of time or guess the word correctly."
    },
    {
      question: "Can I see other players scores and rank?",
      answer: "Termometer includes a global leaderboard where you can see the top players and their scores. Compete with players worldwide and climb the ranks to showcase your word mastery."
    }
  ]

  return (
    // bg-gradient-to-r from-neutral-700 via-neutral-900 to-neutral-700
    <div className="flex flex-col min-h-screen text-gray-800">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 shadow-sm relative">
        <Link href="#" className="flex items-center justify-center">
          <span className="ml-2 text-2xl text-white">Termometer</span>
        </Link>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-700 via-white to-red-700"></div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-start px-4">
        <div className="max-w-4xl mx-auto text-center mt-32 mb-16 p-8">
          <h1 className="text-8xl mb-6">
            <span className="text-white">Termometer</span>
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Turn up the heat on your vocabulary
          </p>

          <div className="mt-8 space-y-4">
            <Button asChild size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105">
              <Link href="/game">
                Play Now
              </Link>
            </Button>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 rounded-lg shadow-md p-6 flex flex-col items-center border border-neutral-500">
              <Clock className="h-12 w-12 text-blue-700 mb-4" />
              <h3 className="text-xl mb-2 text-white">Timed Challenge</h3>
              <p className="text-gray-300 text-center">
                You have 10 minutes to guess the hidden word. Race against the clock to get that high score!
              </p>
            </div>
            <div className="bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center border border-neutral-500">
              <Brain className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl mb- text-white">Word Similarity</h3>
              <p className="text-gray-300 text-center">
                Utilize our vast word database and receive temperature-based scores to guide your guesses and guess the word.
              </p>
            </div>
            <div className="bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 rounded-lg shadow-md p-6 flex flex-col items-center border border-neutral-500">
              <Trophy className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl mb-2 text-white">Leaderboard</h3>
              <p className="text-gray-300 text-center">
                Compete with players worldwide, climb the ranks, and showcase your word mastery on our global leaderboards.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-8 mb-32 bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 rounded-lg shadow-md p-8 border border-neutral-500">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl mb-4 text-white">Similarity Score</h2>
              <p className="text-gray-300">
                Our unique similarity score system provides instant feedback on your guesses.
                The higher the score, the closer you are to the target word. Watch the &apos;termometer&apos;
                rise as you get &quot;hotter&quot; with each guess, guiding you towards the correct answer.
              </p>
            </div>
            <div className="md:w-1/2">
              <AnimatedThermometer />
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 mb-32 p-8 bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 rounded-lg shadow-md border border-neutral-500">
          <h2 className="text-3xl mb-6 text-center text-white">Leaderboard</h2>
          <p className="mb-4 ml-4 text-gray-300">Termometer&apos;s leaderboard displays all of our players, ranked upon their scores and amount of games won.</p>
          <div className="bg-neutral-900 p-4 rounded-lg mb-4 ml-4 mr-4 border border-gray-300">
            <h3 className="text-xl mb-4 text-white">Top Players</h3>
            <ol className="list-none">
              <li className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-gray-300 font-medium">Player 1 - 1,200 pts</span>
              </li>
              <li className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-gray-300 font-medium">Player 2 - 1,100 pts</span>
              </li>
              <li className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-gray-300 font-medium">Player 3 - 1,000 pts</span>
              </li>
            </ol>
          </div>
          <div className="text-center mt-8">
            <Button asChild size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105">
              <Link href="/leaderboard">
                View Leaderboard
              </Link>
            </Button>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 mb-32 p-8 bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 rounded-lg shadow-md border border-neutral-500">
          <h2 className="text-3xl mb-6 text-center text-white">Frequently Asked Questions</h2>
          <div className="text-white ml-3">
            {faqItems.map((faqItem, index) => (
              <FAQItem key={index} question={faqItem.question} answer={faqItem.answer} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
