import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GraphVisualComponent } from '../../graph-visual/graph-visual.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ListViewComponent } from "../../list-view/list-view.component";
import { Node } from '../../graph/models/node.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { GraphService } from '../../graph/services/graph.service';
import { nodeStyle } from '../../graph/models/nodeStyle.model';
import { edgeStyle } from '../../graph/models/edgeStyle.model';
import { VisualNode } from '../../graph/models/visualNode.model';
import { VisualEdge } from '../../graph/models/visualEdge.model';
import { Message } from '../../game/model/message.model';
import { MessageFormComponent } from "../message-form/message-form.component";
import { MessageListViewComponent } from "../message-list-view/message-list-view.component";
import { ResponseOption } from '../../game/model/response.model';
import { MessageService } from '../../game/services/message.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { NewLoopDialogComponent } from '../dialog/new-loop-dialog/new-loop-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { PhoneScreenComponent } from "../../phone-screen/phone-screen.component";
import { MatIconModule } from '@angular/material/icon';
import { MessagesComponent } from "../../messages/messages.component";
import { FormArray, FormBuilder } from '@angular/forms';

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
    MessageListViewComponent,
    PhoneScreenComponent,
    MatIconModule,
    MessagesComponent
  ],
  providers: [
    CookieService
  ],
  templateUrl: './editor-page.component.html',
  styleUrl: './editor-page.component.scss'
})
export class EditorPageComponent implements OnInit, OnChanges {

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
        { id: 'O1-1', next: 'M-3', text: "It sure is!" },
        { id: 'O2-1', next: 'M-3', text: "..." }
      ]
    },
    {
      id: 'M-2', body: "To you too!", sender: "conact", next: undefined, wait: 1000, showOptions: true, responseOptions: [
        { id: 'O0-2', next: 'M-4', text: "Have you heard the news" },
        { id: 'O1-2', next: 'M-1', text: "What if..." }
      ]
    },
    { id: 'M-3', body: "I just love basking in the sun!", sender: "conact", next: undefined, wait: 1000, showOptions: false, responseOptions: [] },
    { id: 'M-4', body: "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet", sender: "conact", next: 'M-5', wait: 1000, showOptions: false, responseOptions: [] },
    { id: 'M-5', body: "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet", sender: "conact", next: undefined, wait: 1000, showOptions: false, responseOptions: [] },
  ];
  messagePath: Message[] = [];
  selectedResponseOptions: string[] = [];
  counter: number = 0;


  nodeStyle: nodeStyle = { height: '80px', width: '80px', margin: '50px', classList: '' };
  edgeStyle: edgeStyle = { strokeColor: 'black', strokeWidth: '4', doubleEdgeOffset: 30 };

  visualNodes: VisualNode[] = [];
  visualEdges: VisualEdge[] = [];

  isDrawerOpen: boolean = true;

  choiceForm = this.formBuilder.group({
    choices: this.formBuilder.array([]),
  });

  get choices() {
    return this.choiceForm.get('choices') as FormArray;
  }

  constructor(
    private graphService: GraphService,
    private messageService: MessageService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.saveToCookie();
  }

  ngOnInit(): void {
    this.loadFromCookie();
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
        let selectedOption = lastMessage.responseOptions.find(x => x.id == selectedId);
        console.log(selectedOption);

        if (selectedOption != undefined) selectedOption.next = e.id;
      } else {
        lastMessage.next = id;
      }
    }
    this.messageTree.push(e);
    this.messagePath.push(e);
    this.saveToCookie();
  }

  addOption(e: ResponseOption) {
    if (this.messagePath.length > 0) {
      const lastPath = this.messagePath[this.messagePath.length - 1];
      const last = this.messageTree.find(x => x.id == lastPath.id);
      if (last != undefined) {
        last.showOptions = true;
        // lastTree.showOptions = true;
        e.id = 'O' + last.responseOptions.length + '-' + last.id.split('-')[1]
        this.choices.push(this.formBuilder.control(e.id));
        this.selectedResponseOptions.push(e.id);
        last.responseOptions.push(e);
        // lastTree.responseOptions.push(e);
      }
    }
    this.saveToCookie();
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
      const loopNode = orderedMessagePath.find(x => x.id == next);
      if (loopNode != undefined) {
        const last = orderedMessagePath[orderedMessagePath.length - 1];
        if (last.showOptions) {
          const option = last.responseOptions.find(m => m.id == choices[index - 1]) ?? last.responseOptions[0];
          option.isLoop = true;
        } else {
          last.isLoop = true;
        }
        return orderedMessagePath;
      }
      node = messageTree.find(x => x.id == next);
      if (node == undefined) return orderedMessagePath;
      orderedMessagePath.push(node);
      next = node.next;
      if (node.showOptions && choices != undefined) {
        const option = node.responseOptions.find(m => m.id == choices[index]) ?? node.responseOptions[0];
        next = option?.next;
        index++;
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

  onSelectedTabChange(e: MatTabChangeEvent) {
    if (e.index == 1) {
      this.graph = this.messageService.gameTreeToGraph(this.messageTree);
      this.visualNodes = this.graphService.computeVisualNodes(this.graph, this.nodeStyle);
      this.visualEdges = this.graphService.computeVisualEdges(this.visualNodes, this.edgeStyle);
    }
  }

  openDialog(startMessage?: Message) {
    const startNode = startMessage ?? this.messagePath[this.messagePath.length - 1]
    let dialogRef = this.dialog.open(NewLoopDialogComponent, {
      data: {
        node: startNode,
        tree: this.messageTree
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.addLoop(startNode, result);
      }
    });
  }

  addLoop(startNode: Message, endNodeId: string) {
    startNode.next = endNodeId;
    this.messagePath = this.takeMessagePath(this.messageTree, this.selectedResponseOptions);
    this.saveToCookie();
  }

  deleteMessage(e: { message: Message, prev: Message }) {
    let prev = this.messageTree.find(x => x.id == e.prev.id);
    if (e.message.showOptions) {
      const option = e.message.responseOptions.find(x => this.selectedResponseOptions.includes(x.id))
      if (option != undefined) {
        const index = e.message.responseOptions.indexOf(option)
        e.message.next = e.message.responseOptions[index].next;
      }
    }
    if (prev != undefined) {
      if (prev.showOptions) {
        const option = prev.responseOptions.find(x => this.selectedResponseOptions.includes(x.id))
        if (option != undefined) {
          const index = prev.responseOptions.indexOf(option)
          prev.responseOptions[index].next = e.message.next;
        }
      } else {
        prev.next = e.message.next;
      }
    }
    const index = this.messageTree.indexOf(e.message);
    if (index > -1) {
      this.messageTree.splice(index, 1);
    }

    this.messagePath = this.takeMessagePath(this.messageTree, this.selectedResponseOptions);
  }

  saveToCookie() {
    console.log(this.messageTree);
    this.cookieService.set('MessageTree', JSON.stringify(this.messageTree));
  }

  loadFromCookie(): boolean {
    let cookieValue = this.cookieService.get('MessageTree');
    try {
      this.messageTree = (JSON.parse(cookieValue));
      return true;
    } catch (e) {
      return false;
    }
  }
}
