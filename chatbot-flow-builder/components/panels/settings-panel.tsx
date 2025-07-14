"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { Node } from "reactflow"
import { ArrowLeft, MessageSquare, ImageIcon, MousePointer, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SettingsPanelProps {
  node: Node
  onUpdateNode: (nodeId: string, newData: any) => void
  onClose: () => void
}

export function SettingsPanel({ node, onUpdateNode, onClose }: SettingsPanelProps) {
  const [formData, setFormData] = useState(node.data)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFormData(node.data)
  }, [node.data])

  const handleChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onUpdateNode(node.id, newData)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Create a local URL for the image
      const imageUrl = URL.createObjectURL(file)

      // Update both the URL and file in the data
      const newData = {
        ...formData,
        imageUrl: imageUrl,
        imageFile: file,
      }

      setFormData(newData)
      onUpdateNode(node.id, newData)

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleButtonChange = (index: number, field: string, value: string) => {
    const newButtons = [...(formData.buttons || [])]
    newButtons[index] = { ...newButtons[index], [field]: value }
    handleChange("buttons", newButtons)
  }

  const addButton = () => {
    const newButtons = [
      ...(formData.buttons || []),
      {
        id: Date.now().toString(),
        text: `Option ${(formData.buttons?.length || 0) + 1}`,
        value: `option${(formData.buttons?.length || 0) + 1}`,
      },
    ]
    handleChange("buttons", newButtons)
  }

  const removeButton = (index: number) => {
    const newButtons = formData.buttons?.filter((_: any, i: number) => i !== index) || []
    handleChange("buttons", newButtons)
  }

  const getNodeIcon = () => {
    switch (node.type) {
      case "textNode":
        return <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case "imageNode":
        return <ImageIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      case "buttonNode":
        return <MousePointer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      default:
        return <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    }
  }

  const getNodeTitle = () => {
    switch (node.type) {
      case "textNode":
        return "Message"
      case "imageNode":
        return "Image"
      case "buttonNode":
        return "Quick Replies"
      default:
        return "Node"
    }
  }

  return (
    <div className="p-4 h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onClose} className="p-1 h-8 w-8">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          {getNodeIcon()}
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{getNodeTitle()}</h2>
        </div>
      </div>

      {/* Settings Form */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {/* Text Node Settings */}
        {node.type === "textNode" && (
          <div>
            <Label htmlFor="message-text" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Message Text
            </Label>
            <Textarea
              id="message-text"
              value={formData.label || ""}
              onChange={(e) => handleChange("label", e.target.value)}
              placeholder="Enter your message here..."
              className="mt-1 min-h-[100px] resize-none"
            />
          </div>
        )}

        {/* Image Node Settings */}
        {node.type === "imageNode" && (
          <>
            <div>
              <Label htmlFor="image-label" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Message Text
              </Label>
              <Input
                id="image-label"
                value={formData.label || ""}
                onChange={(e) => handleChange("label", e.target.value)}
                placeholder="Image message title..."
                className="mt-1"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Image</Label>

              {/* Upload Button */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload from Device
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              </div>

              {/* URL Input */}
              <div>
                <Label htmlFor="image-url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image URL
                </Label>
                <Input
                  id="image-url"
                  value={formData.imageUrl || ""}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>

              {/* Image Preview */}
              {formData.imageUrl && (
                <div className="mt-2">
                  <Label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Preview</Label>
                  <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                    <img
                      src={formData.imageUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.parentElement!.innerHTML =
                          '<div class="text-red-500 text-sm">Failed to load image</div>'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="image-caption" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Caption
              </Label>
              <Textarea
                id="image-caption"
                value={formData.caption || ""}
                onChange={(e) => handleChange("caption", e.target.value)}
                placeholder="Add image caption..."
                className="mt-1 min-h-[60px] resize-none"
              />
            </div>
          </>
        )}

        {/* Button Node Settings */}
        {node.type === "buttonNode" && (
          <>
            <div>
              <Label htmlFor="button-label" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Message Text
              </Label>
              <Textarea
                id="button-label"
                value={formData.label || ""}
                onChange={(e) => handleChange("label", e.target.value)}
                placeholder="Choose an option:"
                className="mt-1 min-h-[60px] resize-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Reply Buttons</Label>
                <Button size="sm" variant="outline" onClick={addButton}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.buttons?.map((button: any, index: number) => (
                  <div key={button.id} className="flex gap-2 items-center p-2 border rounded dark:border-gray-700">
                    <Input
                      value={button.text}
                      onChange={(e) => handleButtonChange(index, "text", e.target.value)}
                      placeholder="Button text"
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeButton(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Node Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div>Node ID: {node.id}</div>
            <div>Type: {node.type}</div>
            <div>
              Position: ({Math.round(node.position.x)}, {Math.round(node.position.y)})
            </div>
          </div>
        </div>
      </div>

      {/* Future Settings Preview */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Advanced Settings (Coming Soon)</div>
        <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
          <div>• Message Delay & Timing</div>
          <div>• Typing Indicator</div>
          <div>• Rich Text Formatting</div>
          <div>• Conditional Logic</div>
        </div>
      </div>
    </div>
  )
}
