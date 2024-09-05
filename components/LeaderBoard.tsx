import { Trophy, Medal } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type LeaderboardEntry = {
  name: string
  score: number
  avatar?: string
}

type LeaderboardProps = {
  leaderboard?: LeaderboardEntry[]
  isMobile?: boolean
}



export default function Leaderboard({ leaderboard , isMobile = false }: LeaderboardProps) {
  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Medal className="h-5 w-5 text-yellow-400" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 2:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return null
    }
  }

  return (
    <div className={`${isMobile ? 'p-4' : 'w-64 h-full bg-white p-4 shadow-lg'} flex flex-col`}>
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
        Leaderboard
      </h2>
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
        {leaderboard?.map((entry, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
            <div className="flex items-center">
              <span className="font-bold mr-2 w-5 text-center">{index + 1}</span>
              {getMedalIcon(index)}
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback>{entry.name[0]}</AvatarFallback>
                {entry.avatar && <img src={entry.avatar} alt={entry.name} className="h-full w-full object-cover" />}
              </Avatar>
              <span className="font-medium truncate max-w-[100px]">{entry.name}</span>
            </div>
            <span className="font-semibold">{entry.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}