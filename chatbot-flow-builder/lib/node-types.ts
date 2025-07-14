import type React from "react"
import { TextNode } from "@/components/nodes/text-node"
import { ImageNode } from "@/components/nodes/image-node"
import { ButtonNode } from "@/components/nodes/button-node"

// Centralized node types registry for extensibility
export const nodeTypes = {
  textNode: TextNode,
  imageNode: ImageNode,
  buttonNode: ButtonNode,
  // Future node types can be easily added here:
  // conditionNode: ConditionNode,
  // delayNode: DelayNode,
  // apiNode: ApiNode,
  // inputNode: InputNode,
}

// Node type definitions for type safety
export interface NodeTypeDefinition {
  type: string
  label: string
  icon: any
  description: string
  component: React.ComponentType<any>
  available: boolean
}

// Registry of available node types
export const availableNodeTypes: NodeTypeDefinition[] = [
  {
    type: "textNode",
    label: "Message",
    icon: "MessageSquare",
    description: "Send a text message",
    component: TextNode,
    available: true,
  },
  {
    type: "imageNode",
    label: "Image",
    icon: "Image",
    description: "Send image with caption",
    component: ImageNode,
    available: true,
  },
  {
    type: "buttonNode",
    label: "Quick Replies",
    icon: "MousePointer",
    description: "Add quick reply buttons",
    component: ButtonNode,
    available: true,
  },
  // Future node types will be added here
]
