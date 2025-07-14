"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ReactFlowProvider,
  type ReactFlowInstance,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import { NodesPanel } from "@/components/panels/nodes-panel"
import { SettingsPanel } from "@/components/panels/settings-panel"
import { PreviewPanel } from "@/components/panels/preview-panel"
import { SaveButton } from "@/components/ui/save-button"
import { ImportExportButtons } from "@/components/ui/import-export-buttons"
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle"
import { nodeTypes } from "@/lib/node-types"
import { validateFlow } from "@/lib/flow-validation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"

// Initial nodes and edges
const initialNodes: Node[] = []
const initialEdges: Edge[] = []

function ChatbotFlowBuilderContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // Handle edge connections with validation and proper styling
  const onConnect = useCallback(
    (params: Connection) => {
      // Check if source handle already has an edge
      const existingEdge = edges.find(
        (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle,
      )

      if (existingEdge) {
        // Remove existing edge before adding new one
        const updatedEdges = edges.filter((edge) => edge.id !== existingEdge.id)
        setEdges(updatedEdges)
      }

      // Create new edge with arrow marker
      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}`,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#6b7280",
        },
        style: {
          stroke: "#6b7280",
          strokeWidth: 2,
        },
      }

      setEdges((eds) => addEdge(newEdge, eds))
    },
    [edges, setEdges],
  )

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  // Handle clicking on empty space to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  // Handle drag and drop from nodes panel
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")
      if (typeof type === "undefined" || !type || !reactFlowInstance) {
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      let defaultData = { label: "New Node" }

      // Set default data based on node type
      switch (type) {
        case "textNode":
          defaultData = { label: "Enter your message here..." }
          break
        case "imageNode":
          defaultData = {
            label: "Image Message",
            imageUrl: "",
            imageFile: null,
            caption: "Add image caption here...",
          }
          break
        case "buttonNode":
          defaultData = {
            label: "Choose an option:",
            buttons: [
              { id: "1", text: "Option 1", value: "option1" },
              { id: "2", text: "Option 2", value: "option2" },
            ],
          }
          break
      }

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: defaultData,
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes],
  )

  // Update selected node data
  const updateNodeData = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node)),
      )

      // Update selected node if it's the one being edited
      if (selectedNode?.id === nodeId) {
        setSelectedNode((prev) => (prev ? { ...prev, data: { ...prev.data, ...newData } } : null))
      }
    },
    [setNodes, selectedNode],
  )

  // Handle save flow
  const handleSave = useCallback(() => {
    const validation = validateFlow(nodes, edges)

    if (!validation.isValid) {
      setSaveError(validation.error || "Cannot save flow")
      // Clear error after 5 seconds
      setTimeout(() => setSaveError(null), 5000)
      return
    }

    setSaveError(null)

    // Here you would typically save to a backend
    console.log("Flow saved successfully!", { nodes, edges })

    // Show success message
    alert("Chatbot flow saved successfully!")
  }, [nodes, edges])

  return (
    <div className="h-screen flex bg-background text-foreground">
      {/* Error Alert */}
      {saveError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert variant="destructive" className="w-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Top Controls - Fixed Layout */}
      <div className="absolute top-4 right-4 z-10">
        {showPreview ? (
          // When preview is shown, only show Preview toggle and Save button
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(false)} className="bg-background">
              <EyeOff className="w-4 h-4 mr-2" />
              Hide Preview
            </Button>
            <SaveButton onClick={handleSave} />
          </div>
        ) : (
          // When preview is hidden, show all controls
          <div className="flex gap-2">
            <DarkModeToggle />
            <ImportExportButtons />
            <Button variant="outline" size="sm" onClick={() => setShowPreview(true)} className="bg-background">
              <Eye className="w-4 h-4 mr-2" />
              Show Preview
            </Button>
            <SaveButton onClick={handleSave} />
          </div>
        )}
      </div>

      {/* Main Flow Area */}
      <div className={`${showPreview ? "flex-1" : "flex-1"} transition-all duration-300`} ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50 dark:bg-gray-900"
            defaultEdgeOptions={{
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: "#6b7280",
              },
              style: {
                stroke: "#6b7280",
                strokeWidth: 2,
              },
            }}
          >
            <Controls className="dark:bg-gray-800 dark:border-gray-700" />
            <Background className="dark:opacity-20" />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <div className="w-80 bg-background border-l border-border">
          <PreviewPanel nodes={nodes} edges={edges} />
        </div>
      )}

      {/* Right Panel - Nodes or Settings */}
      <div className="w-80 bg-background border-l border-border flex flex-col">
        {selectedNode ? (
          <SettingsPanel node={selectedNode} onUpdateNode={updateNodeData} onClose={() => setSelectedNode(null)} />
        ) : (
          <NodesPanel />
        )}
      </div>
    </div>
  )
}

export default function ChatbotFlowBuilder() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ChatbotFlowBuilderContent />
    </ThemeProvider>
  )
}
