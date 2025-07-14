import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { MousePointer } from "lucide-react"

interface ButtonNodeData {
  label: string
  buttons: Array<{
    id: string
    text: string
    value: string
  }>
}

export const ButtonNode = memo(({ data, selected }: NodeProps<ButtonNodeData>) => {
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
      <div className="bg-blue-100 dark:bg-blue-900 px-3 py-2 rounded-t-lg border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <MousePointer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Quick Replies</span>
      </div>

      {/* Node Content */}
      <div className="p-3 space-y-2">
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">{data.label}</div>
        <div className="space-y-1">
          {data.buttons?.map((button, index) => (
            <div
              key={button.id}
              className="px-2 py-1 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300"
            >
              {button.text}
            </div>
          ))}
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

ButtonNode.displayName = "ButtonNode"
