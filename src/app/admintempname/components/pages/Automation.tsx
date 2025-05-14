"use client";

import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Square,
  Circle,
  Triangle,
  Database,
  Mail,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Define custom data type for our nodes
interface CustomNodeData {
  label: string;
  icon: React.ReactNode;
  [key: string]: unknown; // Add index signature to satisfy Record<string, unknown> constraint
}

// Define node types for our workflow
const initialNodes: Node<CustomNodeData>[] = [];

const initialEdges: Edge[] = [];

// Node types definitions
const nodeTypes: NodeTypes = {
  // We can extend this with custom node types later
};

export function Automation() {
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] =
    useNodesState<Node<CustomNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(
    null
  );

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // Handle adding a new node to the canvas
  const addNode = (type: string) => {
    const newNode: Node<CustomNodeData> = {
      id: `node_${nodes.length + 1}`,
      type: "default",
      data: {
        label: type,
        icon: getNodeIcon(type),
      },
      position: { x: 100, y: 100 + nodes.length * 10 },
      style: {
        padding: "10px",
        borderRadius: "8px",
        width: 180,
      },
    };

    setNodes((nds) => [...nds, newNode]);

    toast({
      title: "Node Added",
      description: `Added a new ${type} node to the workflow`,
    });
  };

  // Get icon based on node type
  const getNodeIcon = (type: string): React.ReactNode => {
    switch (type) {
      case "Trigger":
        return <Square className="mr-2" />;
      case "Action":
        return <Circle className="mr-2" />;
      case "Condition":
        return <Triangle className="mr-2" />;
      case "Database":
        return <Database className="mr-2" />;
      case "Email":
        return <Mail className="mr-2" />;
      case "Message":
        return <MessageSquare className="mr-2" />;
      default:
        return <Square className="mr-2" />;
    }
  };

  // Custom node renderer
  const renderNodeContent = (node: Node<CustomNodeData>): React.ReactNode => {
    return (
      <div className="flex items-center">
        {node.data.icon}
        <span>{node.data.label}</span>
      </div>
    );
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Workflow Automation</h1>
        <p className="text-muted-foreground">
          Create automated workflows by dragging and connecting elements
        </p>
      </div>

      <div className="border rounded-lg bg-card h-[calc(100vh-240px)] overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) =>
            setSelectedNode(node as Node<CustomNodeData>)
          }
          fitView
          nodeTypes={nodeTypes}
          attributionPosition="bottom-right"
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <Panel
            position="top-left"
            className="bg-card border rounded-md p-4 shadow-md"
          >
            <div className="space-y-2">
              <h3 className="font-medium mb-2">Add Node</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNode("Trigger")}
                  className="flex items-center"
                >
                  <Square className="h-4 w-4 mr-1" /> Trigger
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNode("Action")}
                  className="flex items-center"
                >
                  <Circle className="h-4 w-4 mr-1" /> Action
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNode("Condition")}
                  className="flex items-center"
                >
                  <Triangle className="h-4 w-4 mr-1" /> Condition
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNode("Database")}
                  className="flex items-center"
                >
                  <Database className="h-4 w-4 mr-1" /> Database
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNode("Email")}
                  className="flex items-center"
                >
                  <Mail className="h-4 w-4 mr-1" /> Email
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNode("Message")}
                  className="flex items-center"
                >
                  <MessageSquare className="h-4 w-4 mr-1" /> Message
                </Button>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-medium mb-2">
            Node Properties: {selectedNode.data.label}
          </h3>
          <p className="text-muted-foreground text-sm">ID: {selectedNode.id}</p>
          <div className="mt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNodes(nodes.filter((n) => n.id !== selectedNode.id));
                setSelectedNode(null);
                toast({
                  title: "Node Deleted",
                  description:
                    "The selected node has been removed from the workflow",
                });
              }}
            >
              Delete Node
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="default"
          onClick={() => {
            toast({
              title: "Workflow Saved",
              description: "Your workflow has been saved successfully",
            });
          }}
          className="flex items-center"
        >
          Save Workflow
        </Button>
      </div>
    </div>
  );
}
