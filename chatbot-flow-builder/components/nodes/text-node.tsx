import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { MessageSquare } from "lucide-react"

interface TextNodeData {
  label: string
}

export const TextNode = memo(({ data, selected }: NodeProps<TextNodeData>) => {
  return (
    <div
      className={`
      bg-white dark:bg-gray-800 border-2 rounded-lg shadow-sm min-w-[200px] max-w-[300px]
      ${selected ? "border-blue-500 shadow-lg" : "border-gray-200 dark:border-gray-700"}
      hover:shadow-md transition-all duration-200
    `}
    >
      {/* Target Handle - Left side, gray circle for receiving connections */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full hover:bg-gray-600 transition-colors"
      />

      {/* Node Header */}
      <div className="bg-teal-100 dark:bg-teal-900 px-3 py-2 rounded-t-lg border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <span className="text-sm font-medium text-teal-800 dark:text-teal-200">Send Message</span>
      </div>

      {/* Node Content */}
      <div className="p-3">
        <div className="text-sm text-gray-700 dark:text-gray-300 break-words">
          {data.label || "Enter your message here..."}
        </div>
      </div>

      {/* Source Handle - Right side, green circle for sending connections */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white rounded-full hover:bg-green-600 transition-colors"
      />
    </div>
  )
})

TextNode.displayName = "TextNode"
