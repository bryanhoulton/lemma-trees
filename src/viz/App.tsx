import "reactflow/dist/style.css";

import React, { useCallback, useMemo, useState } from "react";

import ReactFlow, {
  NodeTypes,
  Panel,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { Pencil, SquareArrowDown, SquareArrowUp } from "tabler-icons-react";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { TreeLoader } from "../structure/generate";
import { LemmaState } from "../structure/types";
import { FlowContext } from "./contexts";
import { CustomNode } from "./customNode";
import { getLayoutedElements, stateToFlow } from "./transform";
import { FlowEdge, FlowNode } from "./types";

const nodeTypes: NodeTypes = {
  default: CustomNode,
};

export default function LayoutFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<LemmaState>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [treeLoader] = useState(new TreeLoader("lemma-tree"));

  const layout = useCallback(
    (nodes: FlowNode[], edges: FlowEdge[]) => {
      const layouted = getLayoutedElements(nodes, edges);

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
    },
    [setNodes, setEdges]
  );

  const redraw = useCallback(() => {
    // Generate all ReactFlow nodes.
    const nodesToLayout: FlowNode[] = [];
    const edgesToLayout: FlowEdge[] = [];

    const { nodes: newNodes, edges: newEdges } = stateToFlow(treeLoader.root);
    newNodes.forEach((node) => nodesToLayout.push(node));
    newEdges.forEach((edge) => edgesToLayout.push(edge));

    // Layout the graph.
    layout(nodesToLayout, edgesToLayout);
  }, [treeLoader.root, layout]);

  const invalidate = useCallback(
    (id: string) => {
      treeLoader.invalidate(id);
      redraw();
    },
    [treeLoader, redraw]
  );

  const validate = useCallback(
    (id: string) => {
      treeLoader.validate(id);
      redraw();
    },
    [treeLoader, redraw]
  );

  const flowContextValue = useMemo(
    () => ({
      invalidate: invalidate,
      validate: validate,
    }),
    [invalidate, validate]
  );

  const onLoad = useCallback(() => {
    treeLoader.load();
    redraw();
    notifications.show({
      title: "Loaded!",
      message: "The tree has been loaded from local storage.",
      color: "green",
    });
  }, [treeLoader, redraw]);

  const onSave = useCallback(() => {
    treeLoader.save();
    notifications.show({
      title: "Saved!",
      message: "The tree has been saved to local storage.",
      color: "green",
    });
  }, [treeLoader]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FlowContext.Provider value={flowContextValue}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          draggable={false}
        >
          {/* Panel of Utilities. */}
          <Panel position="top-right">
            <Group gap="xs">
              {/* Redraw. */}
              <Tooltip label="Redraw">
                <ActionIcon onClick={redraw} size="lg">
                  <Pencil />
                </ActionIcon>
              </Tooltip>

              {/* Save. */}
              <Tooltip label="Save">
                <ActionIcon onClick={onSave} size="lg">
                  <SquareArrowDown />
                </ActionIcon>
              </Tooltip>

              {/* Load */}
              <Tooltip label="Load">
                <ActionIcon onClick={onLoad} size="lg">
                  <SquareArrowUp />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Panel>
        </ReactFlow>
      </FlowContext.Provider>
    </div>
  );
}
