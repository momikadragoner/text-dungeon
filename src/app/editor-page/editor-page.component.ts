import { Component, OnInit } from '@angular/core';
import { GraphVisualComponent } from '../graph-visual/graph-visual.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ListViewComponent } from "../list-view/list-view.component";
import { Node } from '../graph/models/node.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { GraphService } from '../graph/services/graph.service';
import { nodeStyle } from '../graph/models/nodeStyle.model';
import { edgeStyle } from '../graph/models/edgeStyle.model';
import { VisualNode } from '../graph/models/visualNode.model';
import { VisualEdge } from '../graph/models/visualEdge.model';
import { Message } from '../game/model/message.model';
import { MessageFormComponent } from "../message-form/message-form.component";
import { MessageListViewComponent } from "../message-list-view/message-list-view.component";
import { ResponseOption } from '../game/model/response.model';
import { MessageService } from '../game/services/message.service';

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

  // graph: Node[] = [
  //   { id: 'start', edges: ['1', '2', '5'] },
  //   { id: '1', edges: ['3', '4'] },
  //   { id: '2', edges: ['5', 'start'] },
  //   { id: '3', edges: ['1'] },
  //   { id: '4', edges: ['5'] },
  //   { id: '5', edges: ['4'] },
  //   { id: '6', edges: ['7', '8'] },
  //   { id: '7', edges: [] },
  //   { id: '8', edges: [] },
  //   { id: '9', edges: [] },
  // ];
  graph: Node[] = [];
  messageTree: Message[] = [
    { id: 'M-0', body: "Hello Word!", sender: "conact", next: 'M-1', wait: 0, showOptions: false, responseOptions: [] },
    {
      id: 'M-1', body: "It's a beautiful day today!!", sender: "contact", next: undefined, wait: 1000, showOptions: true, responseOptions: [
        { id: 'O0-1', next: 'M-2', text: "Good Morning!" },
        { id: 'O1-1', next: 'M-3', text: "It sure is!" }
      ]
    },
    {
      id: 'M-2', body: "To you too!", sender: "conact", next: undefined, wait: 1000, showOptions: true, responseOptions: [
        { id: 'O0-2', next: undefined, text: "Have you heard the news" },
        { id: 'O1-2', next: undefined, text: "What if..." }
      ]
    },
    { id: 'M-3', body: "I just love basking in the sun!", sender: "conact", next: undefined, wait: 1000, showOptions: false, responseOptions: [] },
  ];
  messagePath: Message[] = [];
  selectedResponseOptions: string[] = [];
  counter: number = 0;


  nodeStyle: nodeStyle = { height: '80px', width: '80px', margin: '50px', classList: '' };
  edgeStyle: edgeStyle = { strokeColor: 'black', strokeWidth: '4', doubleEdgeOffset: 30 };

  visualNodes: VisualNode[] = [];
  visualEdges: VisualEdge[] = [];

  isDrawerOpen: boolean = true;

  constructor(
    private graphService: GraphService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.selectedResponseOptions = this.defaultChoices(this.messageTree);
    this.messagePath = this.takeMessagePath(this.messageTree, this.selectedResponseOptions);
    this.graph = this.messageService.gameTreeToGraph(this.messageTree);
    this.visualNodes = this.graphService.computeVisualNodes(this.graph, this.nodeStyle);
    this.visualEdges = this.graphService.computeVisualEdges(this.visualNodes, this.edgeStyle);
    console.log(this.visualNodes);
    console.log(this.visualEdges);
  }

  addMessage(e: Message) {
    this.counter = Math.max(this.messageTree.length, this.counter);
    let id = 'M-' + this.counter.toString(16);
    while (this.messageTree.find(x => x.id == id) != undefined) {
      this.counter++;
      id = 'M-' + this.counter.toString(16);
    }
    e.id = id;

    if (this.messagePath.length > 0) {
      const lastMessageId = this.messagePath[this.messagePath.length - 1].id;
      const lastMessage = this.messageTree.find(x => x.id == lastMessageId);
      if (lastMessage == undefined) throw new Error();
      if (lastMessage.showOptions && this.selectedResponseOptions.length > 0) {
        const selectedId = this.selectedResponseOptions[this.selectedResponseOptions.length - 1];
        const selectedOption = lastMessage.responseOptions.find(x => x.id == selectedId);
        if (selectedOption != undefined) selectedOption.next = e.id;
      } else {
        lastMessage.next = id;
      }
    }
    this.messageTree.push(e);
    this.messagePath = this.takeMessagePath(this.messageTree, this.selectedResponseOptions);
  }

  addOption(e: ResponseOption) {
    if (this.messagePath.length > 0) {
      const last = this.messagePath[this.messagePath.length - 1];
      last.showOptions = true;
      e.id = 'O' + last.responseOptions.length + '-' + last.id.split('-')[1]
      last.responseOptions.push(e);
    }
  }

  takeMessagePath(messageTree: Message[], choices: string[]): Message[] {
    if (messageTree.length == 0) {
      return [];
    }
    const orderedMessagePath: Message[] = [];
    let index = 0;
    let node: Message | undefined = messageTree[0]
    let next: string | undefined = node.next;
    if (node.showOptions && choices != undefined) {
      const option = node.responseOptions.find(m => m.id == choices[index]);
      next = option?.next;
      index++;
    }
    orderedMessagePath.push(node);
    while (next != undefined) {
      node = messageTree.find(x => x.id == next);
      if (node != undefined) {
        orderedMessagePath.push(node);
        next = node.next;
        if (node.showOptions && choices != undefined) {
          const option = node.responseOptions.find(m => m.id == choices[index]);
          next = option?.next;
          index++;
        }
      }
    }
    return orderedMessagePath;
  }

  defaultChoices(messageTree: Message[]): string[] {
    const choises: string[] = [];
    messageTree.forEach(x => {
      if (x.showOptions) {
        choises.push(x.responseOptions[0].id);
      }
    })
    return choises;
  }

  onPathChange(e: any[]) {
    this.selectedResponseOptions = [];
    e.forEach(x => {
      this.selectedResponseOptions.push(x);
    });
    this.messagePath = this.takeMessagePath(this.messageTree, e);
  }
}
