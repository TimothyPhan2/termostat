'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Flag } from 'lucide-react'

interface GiveUpButtonProps {
  onGiveUp: () => void;
  isGameActive: boolean;
}

export default function GiveUpButton({ onGiveUp, isGameActive }: GiveUpButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleGiveUp = () => {
    setIsOpen(false)
    onGiveUp()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="lg" 
          className="flex items-center space-x-2 w-full"
          disabled={!isGameActive}
        >
          <span>Give Up</span>
          <Flag className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to give up?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will end the game immediately. Your current score will be recorded as your final score.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleGiveUp}>Yes, Give Up</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}