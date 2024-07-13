import { Component, OnInit } from '@angular/core';
import { GraphVisualComponent } from '../graph-visual/graph-visual.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ListViewComponent } from "../list-view/list-view.component";
import { Node } from '../graph/models/node.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { GraphService } from '../graph/services/graph.service';
import { nodeStyle } from '../graph/models/nodeStyle.model';
import { edgeStyle } from '../graph/models/edgeStyle.model';
import { VisualNode } from '../graph/models/visualNode.model';
import { VisualEdge } from '../graph/models/visualEdge.model';

@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    GraphVisualComponent,
    ListViewComponent
],
  templateUrl: './editor-page.component.html',
  styleUrl: './editor-page.component.scss'
})
export class EditorPageComponent implements OnInit{
  nodes: Node[] = [
    { id: 'start', edges: ['1', '2'] },
    { id: '1', edges: ['3', '4'] },
    { id: '2', edges: ['5'] },
    { id: '3', edges: [] },
    { id: '4', edges: ['5'] },
    { id: '5', edges: [] },
  ];

  graphService:GraphService;

  nodeStyle: nodeStyle = { height: '80px', width: '80px', margin: '50px', classList: 'primary' };
  edgeStyle: edgeStyle = { strokeColor: 'black', strokeWidth: '4' };

  visualNodes: VisualNode[] = [];
  visualEdges: VisualEdge[] = [];

  constructor(graphService:GraphService) {
    this.graphService = graphService; 
  }

  ngOnInit(): void {
    this.visualNodes = this.graphService.computeVisualNodes(this.nodes, this.nodeStyle);
    this.visualEdges = this.graphService.computeVisualEdges(this.visualNodes, this.edgeStyle);
  }
}
