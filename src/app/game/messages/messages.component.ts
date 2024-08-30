import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Message } from '../model/message.model';
import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { ResponseOption } from '../model/response.model';
import { MatAccordion } from '@angular/material/expansion';
import { ContactProfile } from '../model/profile.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GameData } from '../model/game-data.model';
import { GameService } from '../services/game.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'messages',
  standalone: true,
  imports: [MatGridListModule, MatAccordion, MatButtonModule, MatIconModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
  animations: [
    trigger('changeResponseBoxVisibility', [
      transition(':leave', [
        style({
          opacity: 1,
          overflow: 'hidden'
        }),
        animate('100ms', style({ height: 0, opacity: 0 }))
      ]),
      transition(':enter', [
        style({
          height: 0,
          opacity: 0,
          overflow: 'hidden'
        }),
        animate('100ms', style({ height: '*', opacity: 1 }))
      ])
    ]
    ),
    trigger('arrivingMessages', [
      transition(':enter', [
        query(':self', [
          style({ opacity: 0, transform: 'translateY(100px)' }),
          stagger(30, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ])
  ]
})
export class MessagesComponent implements OnChanges, OnInit {

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    if (!this.inDevMode) {
      this.gameService.getGameData(this.gameId).subscribe(data => {
        this.gameData = data;
        this.reciveMessage(this.startPoint);
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.messages = []
    // this.reciveMessage(this.startPoint);
  }

  responseBoxVisible = false;

  messages: Message[] = [];
  responses: ResponseOption[] = [];
  selectedChatIndex = 0;

  gameDataObservable: Observable<GameData> | undefined;
  @Input() gameData: GameData | undefined;
  @Input() gameId: string = '';
  @Input() startPoint: string = '0';
  @Input() inDevMode: boolean = false;

  get profiles(): ContactProfile[] {
    return this.gameData?.profiles ?? [];
  }

  get messageTree(): Message[] {
    return this.gameData?.chats[this.selectedChatIndex].messageTree ?? [];
  }

  get chatName():string {
    return this.gameData?.chats[this.selectedChatIndex].chatName ?? 'None';
  }

  respond(id: string): void {
    let resp: ResponseOption | undefined = this.responses.find(x => x.id == id);
    if (resp == undefined || resp.next == undefined) throw new Error();
    this.messages.push({
      id: resp.id, body: resp.text, sender: "player", next: "0", showOptions: false, wait: 0, responseOptions: []
    });
    this.toggleResponseBoxVisibility();
    this.reciveMessage(resp.next);
  }

  async reciveMessage(id: string) {
    let msg: Message | undefined = this.messageTree.find(x => x.id == id);
    if (msg == undefined) {
      throw new Error();
    }
    await this.delay(msg.wait);
    this.messages.push(msg);
    if (msg.showOptions) {
      this.responses = msg.responseOptions;
      this.toggleResponseBoxVisibility();
    } else {
      if (msg.next != null) this.reciveMessage(msg.next);
    }
  }

  toggleResponseBoxVisibility(): void {
    this.responseBoxVisible = !this.responseBoxVisible;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  messageStyle(id: string, index: number): string {
    var style: string = "";
    var item: any = this.messages.find(x => x.id == id);
    // var index: number = this.messages.indexOf(item);
    var m = this.messages;
    if (item.sender == "player") {
      style += "primary";
      style += " " + this.layerDecide(m, index) + "-end"
    }
    else if (item.sender == "system") {
      style += "system"
    }
    else {
      style += "secondary";
      style += " " + this.layerDecide(m, index) + "-start"
    }
    return style;
  }

  messageJustify(type: string): string {
    var justify: string = "";
    switch (type) {
      case "player":
        justify = "justify-content-end";
        break;
      case "system":
        justify = "justify-content-center";
        break;
      default:
        justify = "justify-content-start";
        break;
    }
    return justify;
  }

  getUsername(id: string) {
    return this.profiles.find(x => x.id == id)?.username;
  }

  getColor(m: Message, index: number) {
    if (this.showUserName(m, index)) {
      return 'gradient-' + this.profiles.find(x => x.id == m.sender)?.color;
    }
    return 'none';
  }

  showUserName(m: Message, index: number) {
    const layer = this.layerDecide(this.messages, index);
    return (layer == 'top' || layer == 'none' && m.sender != 'player' && m.sender != 'system');
  }

  layerDecide(m: Message[], index: number): string {
    var isTop: boolean = false;
    var isBottom: boolean = false;
    if (m[index - 1] && m[index].sender == m[index - 1].sender) {
      isBottom = true;
    }
    if (m[index + 1] && m[index].sender == m[index + 1].sender) {
      isTop = true;
    }
    if (isTop && isBottom) {
      return "mid";
    }
    if (isTop) {
      return "top"
    }
    if (isBottom) {
      return "bottom";
    }
    return "none"
  }

  refresh() {
    this.messages = []
    this.reciveMessage(this.startPoint);
    this.responseBoxVisible = false;
  }
}
