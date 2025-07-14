"use client"

import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SaveButtonProps {
  onClick: () => void
}

export function SaveButton({ onClick }: SaveButtonProps) {
  return (
    <Button onClick={onClick} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
      <Save className="w-4 h-4 mr-2" />
      Save Changes
    </Button>
  )
}
