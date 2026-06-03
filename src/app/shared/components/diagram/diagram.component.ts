import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { DiagramNode } from '../../../core/models/architecture-pattern.model';

export interface LayoutNode extends DiagramNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutEdge {
  fromId: string;
  toId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const NODE_WIDTH = 140;
const NODE_HEIGHT = 48;
const H_GAP = 60;
const V_GAP = 72;
const SVG_PADDING = 32;

@Component({
  selector: 'app-diagram',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './diagram.component.html',
  styleUrl: './diagram.component.css',
})
export class DiagramComponent {
  readonly nodes = input.required<DiagramNode[]>();

  readonly uid = 'diag-' + Math.random().toString(36).slice(2, 7);
  readonly arrowId = this.uid + '-arrow';
  readonly glowId = this.uid + '-glow';

  readonly layout = computed(() => computeLayout(this.nodes()));

  readonly viewBox = computed(() => {
    const { layoutNodes } = this.layout();
    if (!layoutNodes.length) return '0 0 400 200';
    const maxX = Math.max(...layoutNodes.map(n => n.x + n.width));
    const maxY = Math.max(...layoutNodes.map(n => n.y + n.height));
    return `0 0 ${maxX + SVG_PADDING} ${maxY + SVG_PADDING}`;
  });

  readonly svgHeight = computed(() => {
    const { layoutNodes } = this.layout();
    if (!layoutNodes.length) return 200;
    return Math.max(...layoutNodes.map(n => n.y + n.height)) + SVG_PADDING;
  });

  nodeLabel(label: string): string[] {
    return label.split('\n');
  }

  nodeFill(type: DiagramNode['type']): string {
    switch (type) {
      case 'actor':    return 'rgba(59, 130, 246, 0.15)';
      case 'service':  return 'rgba(124, 58, 237, 0.18)';
      case 'boundary': return 'rgba(20, 184, 166, 0.12)';
      case 'layer':    return 'rgba(30, 41, 59, 0.7)';
    }
  }

  nodeStroke(type: DiagramNode['type']): string {
    switch (type) {
      case 'actor':    return '#3b82f6';
      case 'service':  return '#7c3aed';
      case 'boundary': return '#14b8a6';
      case 'layer':    return '#475569';
    }
  }

  nodeStrokeDasharray(type: DiagramNode['type']): string {
    return type === 'boundary' ? '5 3' : 'none';
  }

  nodeTextColor(type: DiagramNode['type']): string {
    switch (type) {
      case 'actor':    return '#93c5fd';
      case 'service':  return '#c4b5fd';
      case 'boundary': return '#5eead4';
      case 'layer':    return '#94a3b8';
    }
  }

  nodeRx(type: DiagramNode['type']): number {
    return type === 'actor' ? 24 : 6;
  }
}

function computeLayout(nodes: DiagramNode[]): { layoutNodes: LayoutNode[]; edges: LayoutEdge[] } {
  if (!nodes.length) return { layoutNodes: [], edges: [] };

  // Build adjacency and in-degree maps
  const idSet = new Set(nodes.map(n => n.id));
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const inDegree = new Map<string, number>(nodes.map(n => [n.id, 0]));

  for (const node of nodes) {
    for (const target of node.connections) {
      if (idSet.has(target)) {
        inDegree.set(target, (inDegree.get(target) ?? 0) + 1);
      }
    }
  }

  // Topological BFS to assign levels
  const levelMap = new Map<string, number>();
  const queue: string[] = [];

  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  // Process in BFS order
  const tempDegree = new Map(inDegree);
  const bfsQueue = [...queue];
  while (bfsQueue.length) {
    const id = bfsQueue.shift()!;
    if (!levelMap.has(id)) levelMap.set(id, 0);
    const node = nodeMap.get(id)!;
    for (const target of (node?.connections ?? [])) {
      if (!idSet.has(target)) continue;
      const newLevel = (levelMap.get(id) ?? 0) + 1;
      if (!levelMap.has(target) || levelMap.get(target)! < newLevel) {
        levelMap.set(target, newLevel);
      }
      tempDegree.set(target, (tempDegree.get(target) ?? 1) - 1);
      if (tempDegree.get(target) === 0) {
        bfsQueue.push(target);
      }
    }
  }

  // Assign any nodes not reached (cycles or isolated)
  for (const node of nodes) {
    if (!levelMap.has(node.id)) levelMap.set(node.id, 0);
  }

  // Group by level
  const levels = new Map<number, string[]>();
  for (const [id, level] of levelMap) {
    if (!levels.has(level)) levels.set(level, []);
    levels.get(level)!.push(id);
  }

  const sortedLevels = [...levels.keys()].sort((a, b) => a - b);

  // Compute positions
  const layoutNodes: LayoutNode[] = [];
  const posMap = new Map<string, { x: number; y: number; width: number; height: number }>();

  for (const level of sortedLevels) {
    const ids = levels.get(level)!;
    const y = SVG_PADDING + level * (NODE_HEIGHT + V_GAP);
    const totalWidth = ids.length * NODE_WIDTH + (ids.length - 1) * H_GAP;

    // Center the row — assume SVG canvas is wide enough
    // We will use absolute coordinates and let viewBox handle it
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const rawNode = nodeMap.get(id)!;
      const x = SVG_PADDING + i * (NODE_WIDTH + H_GAP);
      const w = NODE_WIDTH;
      const h = NODE_HEIGHT;
      posMap.set(id, { x, y, width: w, height: h });
      layoutNodes.push({ ...rawNode, x, y, width: w, height: h });
    }
    void totalWidth; // suppress unused warning
  }

  // Re-center each row so rows are horizontally centered relative to the widest row
  const maxRowWidth = Math.max(
    ...sortedLevels.map(level => {
      const ids = levels.get(level)!;
      return ids.length * NODE_WIDTH + (ids.length - 1) * H_GAP;
    })
  );

  for (const level of sortedLevels) {
    const ids = levels.get(level)!;
    const rowWidth = ids.length * NODE_WIDTH + (ids.length - 1) * H_GAP;
    const offsetX = (maxRowWidth - rowWidth) / 2;
    for (const id of ids) {
      const pos = posMap.get(id)!;
      pos.x = SVG_PADDING + offsetX + ids.indexOf(id) * (NODE_WIDTH + H_GAP);
      posMap.set(id, pos);
    }
  }

  // Update layoutNodes with centered positions
  for (const ln of layoutNodes) {
    const pos = posMap.get(ln.id)!;
    ln.x = pos.x;
    ln.y = pos.y;
  }

  // Build edges
  const edges: LayoutEdge[] = [];
  for (const node of nodes) {
    const from = posMap.get(node.id);
    if (!from) continue;
    for (const targetId of node.connections) {
      const to = posMap.get(targetId);
      if (!to) continue;
      edges.push({
        fromId: node.id,
        toId: targetId,
        x1: from.x + from.width / 2,
        y1: from.y + from.height,
        x2: to.x + to.width / 2,
        y2: to.y,
      });
    }
  }

  return { layoutNodes, edges };
}