"use client"

import type React from "react"

import {
  MessageSquare,
  ImageIcon,
  MousePointer,
  GitBranch,
  Clock,
  Globe,
  FileInput,
  Plus,
  Sparkles,
} from "lucide-react"

// Core Features - Only what was requested
const coreNodeTypes = [
  {
    type: "textNode",
    label: "Message",
    icon: MessageSquare,
    description: "Send a text message",
    available: true,
  },
]

// Add-on Features - Bonus implementations
const addonNodeTypes = [
  {
    type: "imageNode",
    label: "Image",
    icon: ImageIcon,
    description: "Send image with caption",
    available: true,
    badge: "Bonus",
  },
  {
    type: "buttonNode",
    label: "Quick Replies",
    icon: MousePointer,
    description: "Add quick reply buttons",
    available: true,
    badge: "Bonus",
  },
]

// Advanced Features - Coming Soon
const advancedNodeTypes = [
  {
    type: "conditionNode",
    label: "Condition",
    icon: GitBranch,
    description: "If/else branching logic",
    available: false,
    badge: "Advanced",
  },
  {
    type: "delayNode",
    label: "Delay",
    icon: Clock,
    description: "Add timing delays",
    available: false,
    badge: "Coming Soon",
  },
  {
    type: "apiNode",
    label: "API Call",
    icon: Globe,
    description: "External API integration",
    available: false,
    badge: "Coming Soon",
  },
  {
    type: "inputNode",
    label: "User Input",
    icon: FileInput,
    description: "Collect user information",
    available: false,
    badge: "Coming Soon",
  },
]

export function NodesPanel() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const renderNodeType = (nodeType: any, isDraggable = true) => {
    const IconComponent = nodeType.icon

    return (
      <div
        key={nodeType.type}
        className={`
          border-2 rounded-lg p-3 transition-colors
          ${
            isDraggable
              ? "border-dashed border-gray-300 dark:border-gray-600 cursor-grab hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 active:cursor-grabbing"
              : "border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800"
          }
        `}
        draggable={isDraggable}
        onDragStart={isDraggable ? (event) => onDragStart(event, nodeType.type) : undefined}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDraggable ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <IconComponent
              className={`w-5 h-5 ${isDraggable ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-medium ${isDraggable ? "text-gray-800 dark:text-gray-200" : "text-gray-600"}`}>
                {nodeType.label}
              </span>
              {nodeType.badge && (
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    nodeType.badge === "Bonus"
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                      : nodeType.badge === "Advanced"
                        ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
                        : "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400"
                  }`}
                >
                  {nodeType.badge}
                </span>
              )}
            </div>
            <div className={`text-sm ${isDraggable ? "text-gray-500 dark:text-gray-400" : "text-gray-500"}`}>
              {nodeType.description}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Nodes Panel</h2>

      {/* Core Features - As Requested */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Core Features
        </h3>
        <div className="space-y-3">{coreNodeTypes.map((nodeType) => renderNodeType(nodeType, true))}</div>
      </div>

      {/* Add-on Features - Bonus Implementations */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Add-on Features
        </h3>
        <div className="space-y-2">{addonNodeTypes.map((nodeType) => renderNodeType(nodeType, true))}</div>
      </div>

      {/* Advanced Features - Coming Soon */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Advanced Features
        </h3>
        <div className="space-y-2">{advancedNodeTypes.map((nodeType) => renderNodeType(nodeType, false))}</div>
      </div>

      {/* Connection Guide */}
      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">💡 Connection Guide</div>
        <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
          <div>• Drag from 🟢 (source) to ⚫ (target)</div>
          <div>• Flow direction: Left to Right</div>
          <div>• One output per source handle</div>
        </div>
      </div>
    </div>
  )
}
