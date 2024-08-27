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
import { MatDialog } from '@angular/material/dialog';
import { NewLoopDialogComponent } from '../dialog/new-loop-dialog/new-loop-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { PhoneScreenComponent } from "../../phone-screen/phone-screen.component";
import { MatIconModule } from '@angular/material/icon';
import { MessagesComponent } from "../../messages/messages.component";
import { FormArray, FormBuilder } from '@angular/forms';
import { MessageTreeService } from '../../game/services/message-tree.service';
import { MatMenuModule } from '@angular/material/menu';
import { EditMessageDialogComponent } from '../dialog/edit-message-dialog/edit-message-dialog.component';
import { ContactProfile } from '../../game/model/profile.model';
import { ProfileDialogComponent } from '../dialog/profile-dialog/profile-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileListViewComponent } from "../profile/profile-list-view/profile-list-view.component";
import { GameState } from '../../game/model/game-state.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CodeViewComponent } from "../code-view/code-view.component";
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
    MessagesComponent,
    MatMenuModule,
    MatProgressSpinnerModule,
    ProfileListViewComponent,
    CodeViewComponent
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
    // { id: 'M-0', body: "Hello Word!", sender: "conact", next: 'M-1', wait: 0, showOptions: false, responseOptions: [] },
    // {
    //   id: 'M-1', body: "It's a beautiful day today!!", sender: "contact", next: undefined, wait: 1000, showOptions: true, responseOptions: [
    //     { id: 'O0-1', next: 'M-2', text: "Good Morning!" },
    //     { id: 'O1-1', next: 'M-3', text: "It sure is!" },
    //     { id: 'O2-1', next: 'M-3', text: "..." }
    //   ]
    // },
    // {
    //   id: 'M-2', body: "To you too!", sender: "conact", next: undefined, wait: 1000, showOptions: true, responseOptions: [
    //     { id: 'O0-2', next: 'M-4', text: "Have you heard the news" },
    //     { id: 'O1-2', next: 'M-1', text: "What if..." }
    //   ]
    // },
    // { id: 'M-3', body: "I just love basking in the sun!", sender: "conact", next: undefined, wait: 1000, showOptions: false, responseOptions: [] },
    // { id: 'M-4', body: "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet", sender: "conact", next: 'M-5', wait: 1000, showOptions: false, responseOptions: [] },
    // { id: 'M-5', body: "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet", sender: "conact", next: undefined, wait: 1000, showOptions: false, responseOptions: [] },
  ];
  profiles: ContactProfile[] = [{ id: 'contact-one', username: 'Contact One', color: 'blue' }]

  selected: string[] = [];

  messagePath: Message[] = [];

  nodeStyle: nodeStyle = { height: '80px', width: '80px', margin: '50px', classList: '' };
  edgeStyle: edgeStyle = { strokeColor: 'black', strokeWidth: '4', doubleEdgeOffset: 30 };

  visualNodes: VisualNode[] = [];
  visualEdges: VisualEdge[] = [];

  isDrawerOpen: boolean = false;
  drawerWindow: string = 'None';

  choiceForm = this.formBuilder.group({
    choices: this.formBuilder.array([]),
  });

  get choices() {
    return this.choiceForm.get('choices') as FormArray;
  }

  get selectedOptions() {
    return this.choices.value;
  }

  addChoice(value: string) {
    this.choices.push(this.formBuilder.control(value));
  }

  constructor(
    private messageTreeService: MessageTreeService,
    private messageService: MessageService,
    private graphService: GraphService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.saveToCookie();
  }

  ngOnInit(): void {
    this.loadFromCookie();
    this.messageTreeService.messageTree = this.messageTree;
    this.messagePath = this.messageTreeService.takeMessagePath(this.selectedOptions);
    this.graph = this.messageService.gameTreeToGraph(this.messageTreeService.messageTree);
    this.visualNodes = this.graphService.computeVisualNodes(this.graph, this.nodeStyle);
    this.visualEdges = this.graphService.computeVisualEdges(this.visualNodes, this.edgeStyle);

    // console.log(this.visualNodes);
    // console.log(this.visualEdges);
    // console.log(this.messageTree)
    // console.log(this.messageTreeService.messageTree)
  }

  addMessage(e: Message) {
    console.log(this.selected);

    const prevId = this.selected[0] ?? this.messagePath[this.messagePath.length - 1]?.id;
    if (this.messageTreeService.addMessage(e, prevId, this.selectedOptions)) {
      this.messagePath = this.messageTreeService.takeMessagePath(this.selectedOptions);
      this.saveToCookie();
    } else {
      this.snackBar.open("Message could not be added.", "Close", { horizontalPosition: 'end' })
    }
  }

  addOption(e: ResponseOption) {
    const prevId = this.selected[0] ?? this.messagePath[this.messagePath.length - 1]?.id;
    const isNewFork = !this.messageTreeService.getMessageById(prevId)?.showOptions;
    const newOptionId = this.messageTreeService.addOption(e, prevId);
    if (newOptionId != undefined) {
      if (isNewFork) {
        this.addChoice(newOptionId);
      }
      this.messagePath = this.messageTreeService.takeMessagePath(this.selectedOptions);
      this.saveToCookie();
    } else {
      this.snackBar.open("Option could not be added.", "Close", { horizontalPosition: 'end' })
    }
  }

  onPathChange(e: any) {
    this.messagePath = this.messageTreeService.takeMessagePath(this.selectedOptions);
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

  openEditDialog(message?: Message) {
    let dialogRef = this.dialog.open(EditMessageDialogComponent, {
      data: {
        message: message ?? this.messagePath[this.messagePath.length - 1],
        tree: this.messageTree,
        profiles: this.profiles
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        console.log(result);

        this.messageTreeService.editMessage(result);
        this.messageTreeService.takeMessagePath(this.selectedOptions);
        this.saveToCookie();
      }
    });
  }

  addLoop(startNode: Message, endNodeId: string) {
    this.messageTreeService.addLink(startNode.id, endNodeId);
    this.messageTreeService.takeMessagePath(this.selectedOptions);
    this.saveToCookie();
  }

  deleteMessage(e: { message: Message, prev: Message }) {
    if (e.prev == undefined) {
      this.snackBar.open("Can't delete root message, please edit instead.", "Close", { horizontalPosition: 'end' })
      return;
    }
    if (this.messageTreeService.deleteMessage(e.message, e.prev.id, this.selectedOptions)) {
      this.messagePath = this.messageTreeService.takeMessagePath(this.selectedOptions);
      this.saveToCookie();
    } else {
      this.snackBar.open("Could not delete message.", "Close", { horizontalPosition: 'end' })
    }
  }

  openProfileDialog() {
    let dialogRef = this.dialog.open(ProfileDialogComponent, {
      data: {
        type: 'add'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.profiles.push(result);
        console.log(this.profiles);
      }
    });
    this.saveToCookie();
  }

  get JsonGameState() {
    const gameState: GameState = {
      profiles: this.profiles,
      messageTree: this.messageTree
    };
    return JSON.stringify(gameState, null, 2);
  }

  toggleDrawer(windowName: string) {
    if (this.drawerWindow != windowName) {
      this.drawerWindow = windowName;
      this.isDrawerOpen = true;
    } else {
      this.isDrawerOpen = false;
      this.drawerWindow = "None";
    }
  }

  saveToCookie() {
    const gameState: GameState = {
      profiles: this.profiles,
      messageTree: this.messageTree
    };
    this.cookieService.set('gameState', JSON.stringify(gameState));
  }

  loadFromCookie(): boolean {
    let cookieValue = this.cookieService.get('gameState');
    try {
      const gameState: GameState = (JSON.parse(cookieValue));
      this.profiles = gameState.profiles;
      this.messageTree = gameState.messageTree;
      return true;
    } catch (e) {
      return false;
    }
  }
}
