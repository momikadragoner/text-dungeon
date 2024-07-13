import { Component, HostListener, Input, OnInit } from '@angular/core';
import { NodeComponent } from './node/node.component';
import { EdgeComponent } from './edge/edge.component';
import { Node } from '../graph/models/node.model';
import { VisualNode } from '../graph/models/visualNode.model';
import { Edge } from '../graph/models/edge.model';
import { nodeStyle } from '../graph/models/nodeStyle.model';
import { edgeStyle } from '../graph/models/edgeStyle.model';
import { VisualEdge } from '../graph/models/visualEdge.model';
import { GraphService } from '../graph/services/graph.service';

@Component({
  selector: 'graph-visual',
  standalone: true,
  imports: [
    NodeComponent,
    EdgeComponent
  ],
  templateUrl: './graph-visual.component.html',
  styleUrl: './graph-visual.component.scss'
})
export class GraphVisualComponent {

  @Input() visualNodes: VisualNode[] = [];
  @Input() visualEdges: VisualEdge[] = [];

  selected: string | undefined = undefined;
  graphService:GraphService
  
  constructor(graphService:GraphService) {
    this.graphService = graphService;
  }

  nodeMouseDown(id: string, $event: any) {
    $event.preventDefault();
    this.selected = id;
  }

  nodeMouseUp($event: any) {
    $event.preventDefault();
    this.selected = undefined;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: any) {
    if (this.selected != undefined) {
      const n = this.visualNodes.find(x => x.id == this.selected);
      if (n != undefined) {
        const newX = this.graphService.getValue(n.x) + e.movementX;
        const newY = this.graphService.getValue(n.y) + e.movementY;
        n.x = newX + 'px';
        n.y = newY + 'px';
        n.midX = newX + this.graphService.getValue(n.width) / 2;
        n.midY = newY + this.graphService.getValue(n.height) / 2;
      }
      this.visualEdges = this.graphService.recomputeViusalEdges(this.visualNodes, this.visualEdges, this.selected);
    }
  }
}
