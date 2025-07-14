import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { ImageIcon } from "lucide-react"

interface ImageNodeData {
  label: string
  imageUrl: string
  caption: string
  imageFile?: File | null
}

export const ImageNode = memo(({ data, selected }: NodeProps<ImageNodeData>) => {
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
      <div className="bg-purple-100 dark:bg-purple-900 px-3 py-2 rounded-t-lg border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Send Image</span>
      </div>

      {/* Node Content */}
      <div className="p-3 space-y-2">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{data.label}</div>
        <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
          {data.imageUrl ? (
            <img
              src={data.imageUrl || "/placeholder.svg"}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-400" />
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{data.caption}</div>
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

ImageNode.displayName = "ImageNode"
