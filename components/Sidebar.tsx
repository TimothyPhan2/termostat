"use client"
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type SidebarProps = {
  isMobile?: boolean
}

export default function Sidebar({ isMobile = false }: SidebarProps) {
  const [isHintOpen, setIsHintOpen] = useState(false)

  return (
    <div className={`${isMobile ? 'p-4' : 'w-64 h-full bg-white p-4 shadow-lg'} flex flex-col`}>
      <h2 className="text-xl font-bold mb-4">Hints</h2>
      <button
        onClick={() => setIsHintOpen(!isHintOpen)}
        className="flex items-center justify-between w-full p-2 bg-blue-500 text-white rounded"
      >
        <span>Show Hint</span>
        {isHintOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isHintOpen && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <p>This is where your hint would go.</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Score Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            <span>0-249: Cold</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span>250-499: Warm</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
            <span>500-749: Hot</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span>750-1000: Very Hot</span>
          </div>
        </div>
      </div>
    </div>
  )
}