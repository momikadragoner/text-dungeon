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
import { PhoneScreenComponent } from "../../game/phone-screen/phone-screen.component";
import { MatIconModule } from '@angular/material/icon';
import { MessagesComponent } from "../../game/messages/messages.component";
import { FormArray, FormBuilder } from '@angular/forms';
import { MessageTreeService } from '../../game/services/message-tree.service';
import { MatMenuModule } from '@angular/material/menu';
import { EditMessageDialogComponent } from '../dialog/edit-message-dialog/edit-message-dialog.component';
import { ContactProfile } from '../../game/model/profile.model';
import { ProfileDialogComponent } from '../dialog/profile-dialog/profile-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileListViewComponent } from "../profile/profile-list-view/profile-list-view.component";
import { GameData } from '../../game/model/game-data.model';
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

  profiles: ContactProfile[] = [{ id: 'contact-one', username: 'Contact One', color: 'blue' }]

  get messageTree(): Message[] {
    return this.gameData.chats[0].messageTree
  }

  set messageTree(value:Message[]) {
    this.gameData.chats[0].messageTree = value;
  }

  get chatName(): string {
    return this.gameData.chats[0].chatName;
  }

  set chatName(value:string) {
    this.gameData.chats[0].chatName = value;
  }

  selected: string[] = [];
  messagePath: Message[] = [];

  graph: Node[] = [];

  nodeStyle: nodeStyle = { height: '80px', width: '80px', margin: '50px', classList: '' };
  edgeStyle: edgeStyle = { strokeColor: 'black', strokeWidth: '4', doubleEdgeOffset: 30 };

  visualNodes: VisualNode[] = [];
  visualEdges: VisualEdge[] = [];

  gameData: GameData = {
    profiles: this.profiles,
    chats: [
      {
        chatName: 'New Chat',
        messageTree: [],
      }
    ]
  };

  isDrawerOpen: boolean = false;
  drawerWindow: string = 'None';

  choiceForm = this.formBuilder.group({
    choices: this.formBuilder.array([]),
  });

  get choices() {
    return this.choiceForm.get('choices') as FormArray;
  }

  addChoice(value: string) {
    this.choices.push(this.formBuilder.control(value));
  }

  get selectedOptions() {
    return this.choices.value;
  }

  get JsonGameState() {
    const gameState: GameData = this.gameData;
    return JSON.stringify(gameState, null, 2);
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
    const gameState: GameData = this.gameData;
    this.cookieService.set('gameState', JSON.stringify(gameState));
  }

  loadFromCookie(): boolean {
    let cookieValue = this.cookieService.get('gameState');
    try {
      const gameState: GameData = (JSON.parse(cookieValue));
      this.profiles = gameState.profiles;
      this.messageTree = gameState.chats[0].messageTree;
      return true;
    } catch (e) {
      return false;
    }
  }
}
