import type { Node, Edge } from "reactflow"

export interface FlowValidationResult {
  isValid: boolean
  error?: string
}

export function validateFlow(nodes: Node[], edges: Edge[]): FlowValidationResult {
  // If there's only one node or no nodes, it's valid
  if (nodes.length <= 1) {
    return { isValid: true }
  }

  // Check if there are more than one nodes with empty target handles
  const nodesWithoutIncomingEdges = nodes.filter((node) => {
    return !edges.some((edge) => edge.target === node.id)
  })

  // If more than one node has no incoming edges, it's invalid
  if (nodesWithoutIncomingEdges.length > 1) {
    return {
      isValid: false,
      error: "Cannot save Flow: More than one node has empty target handles",
    }
  }

  return { isValid: true }
}

// Additional validation functions for future use
export function validateNodeConnections(nodes: Node[], edges: Edge[]): boolean {
  // Ensure each source handle has at most one outgoing edge
  const sourceConnections = new Map<string, number>()

  edges.forEach((edge) => {
    const key = `${edge.source}-${edge.sourceHandle}`
    sourceConnections.set(key, (sourceConnections.get(key) || 0) + 1)
  })

  return Array.from(sourceConnections.values()).every((count) => count <= 1)
}

export function findDisconnectedNodes(nodes: Node[], edges: Edge[]): Node[] {
  return nodes.filter((node) => {
    const hasIncoming = edges.some((edge) => edge.target === node.id)
    const hasOutgoing = edges.some((edge) => edge.source === node.id)
    return !hasIncoming && !hasOutgoing && nodes.length > 1
  })
}
