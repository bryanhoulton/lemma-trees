import cuid from "cuid";
import { Edge, Node } from "reactflow";

import Dagre from "@dagrejs/dagre";

import { LemmaState } from "../structure/types";
import { FlowEdge, FlowNode } from "./types";

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const NODE_WIDTH = 150;
const NODE_HEIGHT = (text: string) => {
  return 50 + (text.length / 20) * 45;
};

export function getLayoutedElements(
  nodes: FlowNode[],
  edges: FlowEdge[]
): {
  nodes: FlowNode[];
  edges: FlowEdge[];
} {
  g.setGraph({ rankdir: "TB" });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      label: node.data.encoding,
      width: NODE_WIDTH,
      height: NODE_HEIGHT(node.data.encoding),
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const { x, y } = g.node(node.id);

      return {
        ...node,
        data: { ...node.data, label: node.data.encoding },
        position: { x, y },
      };
    }),
    edges: edges.map((edge) => ({
      ...edge,
      animated: true,
    })),
  };
}

export function stateToFlow(root: LemmaState): {
  nodes: Set<FlowNode>;
  edges: Set<FlowEdge>;
} {
  const nodes = new Set<Node>();
  const edges = new Set<Edge>();

  // Add self to tree.
  nodes.add({
    id: root.id,
    data: root,
    position: { x: 0, y: 0 },
    draggable: false,
  });

  // Add dependencies to tree.
  root.dependencies.forEach((dependency) => {
    // Get nodes and edges from the dependency's tree.
    const { nodes: dependencyNodes, edges: dependencyEdges } =
      stateToFlow(dependency);

    // Add nodes and edges from dependency tree.
    dependencyNodes.forEach((node) => nodes.add(node));
    dependencyEdges.forEach((edge) => edges.add(edge));

    // Add edges from self to dependency.
    dependencyNodes.forEach((node) => {
      if (
        Array.from(root.dependencies)
          .map((d) => d.id)
          .includes(node.id)
      ) {
        edges.add({
          id: cuid(),
          target: root.id,
          source: node.id,
        });
      }
    });
  });

  return { nodes, edges };
}
