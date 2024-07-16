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
    const unit = this.getUnit(styleObj.margin);
    const margin = this.getValue(styleObj.margin);
    const height = this.getValue(styleObj.height);
    const width = this.getValue(styleObj.width);
    const workNodes: VisualNode[] = [];

    // run bfs and separate into groups
    let group = 1;
    let s = startNode;
    let nodes: VisualNode[] = [];
    while (nodes.length < graph.length) {
      let isStartSet = false;
      this.bfs(graph, s).forEach(n => {
        if (n.color == 'black') {
          n.group = group;
          nodes.push(n);
        }
        else if (!nodes.some(x => x.id == n.id) && !isStartSet) {
          s = n.id;
          isStartSet = true;
        }
      });
      group++;
    }

    let i = 0;
    let dist = 0;
    let grp = 1;
    let level = 0;
    nodes.sort((a, b) => this.sortByGroupThenDistance(a.group, b.group, a.distance, b.distance));
    console.log({sorted: nodes});
    
    nodes.forEach(w => {
      if (w.distance != undefined && w.group != undefined) {

        // set position based on bft distance
        if (w.distance > dist || w.group > grp) {
          dist = w.distance;
          grp = w.group;
          level++;
          i = 0;
        }
        const x = i * (width + margin) + margin;
        const y = level * (height + margin) + margin;

        // set style based on group
        let classes = '' + styleObj.classList;
        if (w.group == undefined) {
          classes += ' primary';
        } else if (w.group % 3 == 0) {
          classes += ' tertary';
        } else if (w.group % 2 == 0) {
          classes += ' secondary';
        } else {
          classes += ' primary';
        }

        workNodes.push({
          id: w.id, edges: w.edges, distance: w.distance, color: w.color, parent: w.parent, group: w.group,
          height: styleObj.height, width: styleObj.width, classList: classes,
          x: String(x) + unit,
          y: String(y) + unit,
          midX: String(x + (width / 2)),
          midY: String(y + (height / 2))
        });
        i++;
      } else {
        workNodes.push(w);
      }
    });
    return workNodes;
  }

  computeVisualEdges(visualGraph: VisualNode[], styleObj: edgeStyle): VisualEdge[] {
    const edges = this.getEdges(visualGraph);
    let doubleEdges: Edge[] = [];
    edges.forEach(e => {
      edges.forEach(f => {
        if (e.end == f.start && e.start == f.end) {
          doubleEdges.push(e);
        }
      })
    })

    return edges.map(e => {
      const startNode: VisualNode = visualGraph.find(x => x.id == e.start) ?? { id: '', edges: [] };
      const endNode: VisualNode = visualGraph.find(x => x.id == e.end) ?? { id: '', edges: [] };

      if (styleObj.doubleEdgeOffset == undefined) {
        throw new Error();
      }

      let path = 'M' + startNode?.midX + ' ' + startNode?.midY;
      if (doubleEdges.includes(e) && doubleEdges.filter(x => x.start == e.end && x.end == e.start).length > 0) {
        const p = this.findCurvePoint(this.getValue(startNode.midX), this.getValue(startNode.midY), this.getValue(endNode.midX), this.getValue(endNode.midY), styleObj.doubleEdgeOffset);
        path += ' Q' + String(p.x) + ' ' + String(p.y) + ' ' + endNode?.midX + ' ' + endNode?.midY;
        doubleEdges = doubleEdges.filter(x => x != e);
      } else if (doubleEdges.includes(e) || doubleEdges.includes({ start: e.end, end: e.start })) {
        const p = this.findCurvePoint(this.getValue(startNode.midX), this.getValue(startNode.midY), this.getValue(endNode.midX), this.getValue(endNode.midY), -styleObj.doubleEdgeOffset);
        path += ' Q' + String(p.x) + ' ' + String(p.y) + ' ' + endNode?.midX + ' ' + endNode?.midY;
      } else {
        path += ' L' + endNode?.midX + ' ' + endNode?.midY;
      }

      return {
        start: startNode,
        end: endNode,
        path: path,
        strokeColor: styleObj.strokeColor,
        strokeWidth: styleObj.strokeWidth
      }
    });
  }

  recomputeViusalEdges(visualGraph: VisualNode[], visualEdges: VisualEdge[], node: string) {
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

  findCurvePoint(Ax: number, Ay: number, Bx: number, By: number, distance: number) {
    const midPointX = (Ax + Bx) / 2;
    const midPointY = (Ay + By) / 2;

    if (Ax == Bx) return { x: midPointX + distance, y:midPointY};
    if (Ay == By) return { x: midPointX, y:midPointY + distance};

    const slope = -1 * ((Bx - Ax) / (By - Ay));
    const delta = distance / Math.sqrt(slope * slope + 1);
    const yPerpendicular = midPointY + (slope >= 0 ? delta : - delta);
    const xPerpendicular = midPointX + (yPerpendicular - midPointY) / slope;

    return { x: Math.round(xPerpendicular), y: Math.round(yPerpendicular) };
  }

  sortByGroupThenDistance(groupA?:number, groupB?:number, distanceA?:number, distanceB?:number) {
    if (groupA == undefined || groupB == undefined || distanceA == undefined || distanceB == undefined) {
      throw new Error();
    }
    const primary = groupA - groupB;
    if (primary == 0) {
      return distanceA - distanceB;
    }
    return primary;
  }
}
