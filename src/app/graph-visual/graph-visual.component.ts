import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NodeComponent } from './node/node.component';
import { EdgeComponent } from './edge/edge.component';
import { Node } from './model/node.model';
import { VisualNode } from './model/visualNode.model';
import { Edge } from './model/edge.model';
import { nodeStyle } from './model/nodeStyle.model';
import { withDebugTracing } from '@angular/router';
import { ListViewComponent } from './list-view/list-view.component';
import { VisualEdge } from './model/visualEdge.model';

@Component({
  selector: 'app-graph-visual',
  standalone: true,
  imports: [
    NodeComponent,
    EdgeComponent,
    ListViewComponent
  ],
  templateUrl: './graph-visual.component.html',
  styleUrl: './graph-visual.component.scss'
})
export class GraphVisualComponent implements OnInit {
  ngOnInit(): void {
    this.visualNodes = this.computeVisualNodes(this.nodes, this.styleObj);

    this.edges = this.getEdgeList(this.nodes, 'start').map(e => {
      return {
        start: this.visualNodes.find(x => x.id == e.start),
        end: this.visualNodes.find(x => x.id == e.end)
      }
    });

    this.paths = this.edges.map(e => {
      return 'M' + e.start?.midX + ' ' + e.start?.midY + ' L' + e.end?.midX + ' ' + e.end?.midY;
    });
  }

  //TODO: maked nodes draggable

  styleObj: nodeStyle = { height: '100px', width: '100px', margin: '50px', classList: 'primary' };

  nodes: Node[] = [
    { id: 'start', edges: ['1', '2'] },
    { id: '1', edges: ['3', '4'] },
    { id: '2', edges: ['5'] },
    { id: '3', edges: [] },
    { id: '4', edges: [] },
    { id: '5', edges: [] },
  ];

  paths: string[] = [];

  edges: VisualEdge[] = [];

  visualNodes: VisualNode[] = [];

  computeVisualNodes(graph: Node[], styleObj: nodeStyle): VisualNode[] {
    const nodes = this.bfs(this.nodes, 'start');
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
          midX: String(x + (width/2)),
          midY: String(y + (height/2))
        });
        console.log(x + (width/2));
        
        i++;
      }
    });
    console.log(workNodes);
    return workNodes;
  }

  getValue(value?: string) {
    return Number(value?.replace(/[a-z]/g, ''));
  }

  getUnit(value?: string) {
    return value?.replace(/[0-9]/g, '');
  }

  getEdgeList(graph: Node[], start: string): Edge[] {
    const edges: Edge[] = [];
    const startNode = this.nodes.find(n => n.id == start);
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

  bfs(graph: Node[], start: string): VisualNode[] {
    let workNodes: VisualNode[] = graph.map(n => {
      return { id: n.id, edges: n.edges, distance: undefined, color: 'white', parent: 'none' };
    });
    const edges: Edge[] = this.getEdgeList(graph, start);

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
