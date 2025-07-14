"use client"

import { useState, useEffect } from "react"
import type { Node, Edge } from "reactflow"
import { Bot, User, Send, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PreviewPanelProps {
  nodes: Node[]
  edges: Edge[]
}

interface ChatMessage {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
  nodeId?: string
}

export function PreviewPanel({ nodes, edges }: PreviewPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null)

  // Initialize chat with first node
  useEffect(() => {
    resetChat()
  }, [nodes, edges])

  const simulateMessage = (node: Node) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: "bot",
      content: node.data.label || "Hello!",
      timestamp: new Date(),
      nodeId: node.id,
    }

    setMessages((prev) => [...prev, newMessage])

    // If it's a button node, show the buttons
    if (node.type === "buttonNode" && node.data.buttons) {
      // Add button options as interactive elements
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `buttons-${Date.now()}`,
            type: "bot",
            content: "buttons",
            timestamp: new Date(),
            nodeId: node.id,
          },
        ])
      }, 500)
    }
  }

  const handleSendMessage = () => {
    if (!currentInput.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: currentInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentInput("")

    // Find next node based on current flow
    if (currentNodeId) {
      const nextEdge = edges.find((edge) => edge.source === currentNodeId)
      if (nextEdge) {
        const nextNode = nodes.find((node) => node.id === nextEdge.target)
        if (nextNode) {
          setTimeout(() => {
            setCurrentNodeId(nextNode.id)
            simulateMessage(nextNode)
          }, 1000)
        }
      }
    }
  }

  const handleButtonClick = (buttonText: string) => {
    // Add user message for button click
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: buttonText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Continue to next node
    if (currentNodeId) {
      const nextEdge = edges.find((edge) => edge.source === currentNodeId)
      if (nextEdge) {
        const nextNode = nodes.find((node) => node.id === nextEdge.target)
        if (nextNode) {
          setTimeout(() => {
            setCurrentNodeId(nextNode.id)
            simulateMessage(nextNode)
          }, 1000)
        }
      }
    }
  }

  const resetChat = () => {
    setMessages([])
    setCurrentInput("")

    if (nodes.length > 0) {
      const startNode = nodes.find((node) => !edges.some((edge) => edge.target === node.id))

      if (startNode) {
        setCurrentNodeId(startNode.id)
        setTimeout(() => simulateMessage(startNode), 500)
      }
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header - Fixed spacing */}
      <div className="p-4 border-b border-border bg-blue-50 dark:bg-blue-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Live Preview</h3>
          </div>
          <Button size="sm" variant="outline" onClick={resetChat} className="flex items-center gap-1 bg-transparent">
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Test your chatbot flow in real-time</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">Add nodes to see the preview</div>
        )}

        {messages.map((message) => (
          <div key={message.id}>
            {message.content === "buttons" ? (
              // Render buttons
              <div className="flex justify-start">
                <div className="max-w-xs">
                  {nodes
                    .find((n) => n.id === message.nodeId)
                    ?.data.buttons?.map((button: any) => (
                      <Button
                        key={button.id}
                        variant="outline"
                        size="sm"
                        className="mr-2 mb-2 bg-transparent"
                        onClick={() => handleButtonClick(button.text)}
                      >
                        {button.text}
                      </Button>
                    ))}
                </div>
              </div>
            ) : (
              // Regular message
              <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.type === "bot" ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    <span className="text-xs opacity-75">{message.type === "bot" ? "Bot" : "You"}</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
