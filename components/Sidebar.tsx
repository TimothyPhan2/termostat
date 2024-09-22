"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

type SidebarProps = {
  isMobile?: boolean;
  hints: string[];
  hasGuessed: boolean;
};

export default function Sidebar({
  isMobile = false,
  hints,
  hasGuessed,
}: SidebarProps) {
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [hintStates, setHintStates] = useState(
    new Array(hints.length).fill(false)
  );

  return (
    <div
      className={`${
        isMobile ? "p-4" : "w-64 h-full bg-white p-4 shadow-lg"
      } flex flex-col`}
    >
      <h2 className="text-xl font-bold mb-4">Hints</h2>
      <Button
        variant="default"
        onClick={() => setIsHintOpen(!isHintOpen)}
        className="flex items-center justify-between w-full p-2 text-white rounded"
        disabled={!hasGuessed}
      >
        <span>Show Hints</span>
        {isHintOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isHintOpen &&
        hints.map((hint, index) => (
          <div key={index}>
            <Button
              variant={hintStates[index] ? "default" : "secondary"}
              onClick={() => {
                const newStates = [...hintStates];
                newStates[index] = !newStates[index];
                setHintStates(newStates);
              }}
              className="w-full p-2 mt-2 bg-gray-200 rounded"
            >
              {hintStates[index] ? "Hide Hint" : "Show Hint"}
            </Button>
            {hintStates[index] && (
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <p className="text-sm font-medium">{hint}</p>
              </div>
            )}
          </div>
        ))}

      {/* Legend */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Score Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            <span>0-349: Very Cold</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-purple-600 mr-2"></div>
            <span>350-549: Cold</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
            <span>550-749: Warm</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span>750-1000: Hot</span>
          </div>
        </div>
      </div>
    </div>
  );
}
