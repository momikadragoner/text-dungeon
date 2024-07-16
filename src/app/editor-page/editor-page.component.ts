import { Component, OnInit } from '@angular/core';
import { GraphVisualComponent } from '../graph-visual/graph-visual.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ListViewComponent } from "../list-view/list-view.component";
import { Node } from '../graph/models/node.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import { GraphService } from '../graph/services/graph.service';
import { nodeStyle } from '../graph/models/nodeStyle.model';
import { edgeStyle } from '../graph/models/edgeStyle.model';
import { VisualNode } from '../graph/models/visualNode.model';
import { VisualEdge } from '../graph/models/visualEdge.model';
import { Message } from '../game/model/message.model';
import { MessageFormComponent } from "../message-form/message-form.component";
import { MessageListViewComponent } from "../message-list-view/message-list-view.component";
import { ResponseOption } from '../game/model/response.model';

@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatTabsModule,
    GraphVisualComponent,
    ListViewComponent,
    MessageFormComponent,
    MessageListViewComponent
],
  templateUrl: './editor-page.component.html',
  styleUrl: './editor-page.component.scss'
})
export class EditorPageComponent implements OnInit {

  graph: Node[] = [
    { id: 'start', edges: ['1', '2', '5'] },
    { id: '1', edges: ['3', '4'] },
    { id: '2', edges: ['5', 'start'] },
    { id: '3', edges: ['1'] },
    { id: '4', edges: ['5'] },
    { id: '5', edges: ['4'] },
    { id: '6', edges: ['7', '8'] },
    { id: '7', edges: [] },
    { id: '8', edges: [] },
    { id: '9', edges: [] },
  ];
  // graph: Node[] = [];
  messageTree: Message[] = [
    { id: 'M-0', body: "Hello Word!", sender: "conact", next: 'M-1', wait: 0, showOptions: false, responseOptions: [] },
    { id: 'M-1', body: "Hello Word!", sender: "contact", next: undefined, wait: 1000, showOptions: false, responseOptions: [] },
  ];
  counter:number = 0;

  graphService: GraphService;

  nodeStyle: nodeStyle = { height: '80px', width: '80px', margin: '50px', classList: '' };
  edgeStyle: edgeStyle = { strokeColor: 'black', strokeWidth: '4', doubleEdgeOffset: 30 };

  visualNodes: VisualNode[] = [];
  visualEdges: VisualEdge[] = [];

  isDrawerOpen: boolean = true;

  constructor(graphService: GraphService) {
    this.graphService = graphService;
  }

  ngOnInit(): void {
    this.visualNodes = this.graphService.computeVisualNodes(this.graph, this.nodeStyle);
    this.visualEdges = this.graphService.computeVisualEdges(this.visualNodes, this.edgeStyle);
    console.log(this.visualNodes);
    console.log(this.visualEdges);
  }

  addMessage(e:Message) {
    this.counter = Math.max(this.messageTree.length, this.counter);
    let id = 'M-' + this.counter.toString(16);
    while (this.messageTree.find(x => x.id == id) != undefined) {
      this.counter++;
      id = 'M-' + this.counter.toString(16);
    }
    e.id = id;
    if (this.messageTree.length > 0) {
      this.messageTree[this.messageTree.length-1].next = id;
    }
    this.messageTree.push(e);
  }

  addOption(e:ResponseOption) {
    if (this.messageTree.length > 0) {
      const last = this.messageTree[this.messageTree.length-1];
      last.showOptions = true;
      e.id = 'O' + last.responseOptions.length + '-' + last.id.split('-')[1]
      last.responseOptions.push(e);
    }
  }
}
