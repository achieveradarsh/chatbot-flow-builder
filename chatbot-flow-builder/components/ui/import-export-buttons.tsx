"use client"

import { Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ImportExportButtons() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" disabled className="bg-white opacity-50 cursor-not-allowed">
        <Upload className="w-4 h-4 mr-2" />
        Import
      </Button>
      <Button variant="outline" size="sm" disabled className="bg-white opacity-50 cursor-not-allowed">
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
    </div>
  )
}
