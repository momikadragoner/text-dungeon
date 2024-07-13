import { Injectable } from '@angular/core';
import { VisualNode } from '../models/visualNode.model';
import { Node } from '../models/node.model';
import { nodeStyle } from '../models/nodeStyle.model';
import { edgeStyle } from '../models/edgeStyle.model';
import { VisualEdge } from '../models/visualEdge.model';
import { Edge } from '../models/edge.model';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor() { }

  computeVisualNodes(graph: Node[], styleObj: nodeStyle, startNode: string = 'start'): VisualNode[] {
    const nodes = this.bfs(graph, startNode);
    const unit = this.getUnit(styleObj.margin);
    const margin = this.getValue(styleObj.margin);
    const height = this.getValue(styleObj.height);
    const width = this.getValue(styleObj.width);
    const workNodes: VisualNode[] = [];
    let i = 0;
    let dist = 0;
    nodes.forEach(w => {
      if (w.distance != undefined) {
        if (w.distance > dist) {
          dist = w.distance;
          i = 0;
        }
        const x = i * (width + margin);
        const y = w.distance * (height + margin);
        workNodes.push({
          id: w.id, edges: w.edges, distance: w.distance, color: w.color, parent: w.parent,
          height: styleObj.height, width: styleObj.width, classList: styleObj.classList,
          x: String(x) + unit,
          y: String(y) + unit,
          midX: String(x + (width / 2)),
          midY: String(y + (height / 2))
        });
        i++;
      }
    });
    return workNodes;
  }

  computeVisualEdges(visualGraph: VisualNode[], styleObj: edgeStyle): VisualEdge[] {
    return this.getEdges(visualGraph).map(e => {
      const startNode = visualGraph.find(x => x.id == e.start);
      const endNode = visualGraph.find(x => x.id == e.end);
      return {
        start: startNode,
        end: endNode,
        path: 'M' + startNode?.midX + ' ' + startNode?.midY + ' L' + endNode?.midX + ' ' + endNode?.midY,
        strokeColor: styleObj.strokeColor,
        strokeWidth: styleObj.strokeWidth
      }
    });
  }

  recomputeViusalEdges(visualGraph: VisualNode[], visualEdges: VisualEdge[], node:string) {
    return visualEdges.map(e => {
      if (e.start?.id == node || e.end?.id == node) {
        const startNode = visualGraph.find(x => x.id == e.start?.id);
        const endNode = visualGraph.find(x => x.id == e.end?.id);
        e.path = 'M' + startNode?.midX + ' ' + startNode?.midY + ' L' + endNode?.midX + ' ' + endNode?.midY;
      }
      return e;
    })
  }

  getValue(value?: string) {
    return Number(value?.replace(/[a-z]/g, ''));
  }

  getUnit(value?: string) {
    return value?.replace(/[0-9]/g, '');
  }

  getEdges(graph: Node[] | VisualNode[]): Edge[] {
    const edges: Edge[] = [];
    graph.forEach(node => {
      node.edges.forEach(e => {
        const edge = { start: node.id, end: e }
        if (!edges.includes(edge)) {
          edges.push(edge)
        }
      })
    })
    return edges;
  }

  getAdjacentNodes(grap: Node[], node: string): string[] {
    const adj: string[] = [];
    this.getEdges(grap).forEach(e => {
      if (e.start == node || e.end == node) {
        adj.push(e.start == node ? e.end : e.start);
      }
    });
    return adj;
  }

  bfs(graph: Node[], start: string): VisualNode[] {
    let workNodes: VisualNode[] = graph.map(n => {
      return { id: n.id, edges: n.edges, distance: undefined, color: 'white', parent: 'none' };
    });
    const edges: Edge[] = this.getEdges(graph);

    const node = workNodes.find(n => n.id == start);
    if (node != undefined) {
      node.distance = 0;
      node.color = 'gray';
    }

    const queue = [];
    queue.push(node);

    while (queue.length > 0) {
      const u: VisualNode | undefined = queue.shift();
      if (u != undefined) {
        edges.filter(e => e.start == u.id || e.end == u.id).forEach(edge => {
          const v = edge.end == u.id ? edge.start : edge.end;
          const currentNode = workNodes.find(w => w.id == v);
          if (currentNode != undefined && currentNode.distance == undefined && u.distance != undefined) {
            currentNode.distance = u.distance + 1;
            currentNode.parent = u.id;
            currentNode.color = 'gray';
            queue.push(currentNode);
          }
        });
        u.color = 'black';
      }
    }
    return workNodes;
  }
}
