import { Component } from '@angular/core';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { Message } from '../model/message.model';
import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { ResponseOption } from '../model/response.model';

@Component({
  selector: 'messages',
  standalone: true,
  imports: [MatFabButton, MatGridListModule],
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
        query('.message', [
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
export class MessagesComponent {

  /**
   *
   */
  constructor() {
    this.reciveMessage('start');
  }
  responseBoxVisible = false;

  messages: Message[] = [];

  incomingMessages: Message[] = [
    {
      id: 'start', body: "Hello Word!", sender: "computer", next: '2', wait: 1000, showOptions: true, responseOptions: [
        { id: 'r1', text: "HI!", next: '3' },
        { id: 'r2', text: "Good morning, America!", next: '3' }
      ]
    },
    { id: '3', body: "What a nice day!", sender: "computer", next: '4', wait: 2000, showOptions: false, responseOptions: [] },
    { id: '4', body: "Hello Word!", sender: "computer", next: '5', wait: 2000, showOptions: false, responseOptions: [] },
    { id: '5', body: "Hello Word!", sender: "computer", next: '6', wait: 3000, showOptions: false, responseOptions: [] },
    { id: '6', body: "Hello Word!", sender: "computer", next: '11', wait: 50, showOptions: false, responseOptions: [] },
    { id: '7', body: "Hello Word!", sender: "player", next: '2', wait: 10, showOptions: false, responseOptions: [] },
    { id: '8', body: "Hello Word!", sender: "player", next: '2', wait: 10, showOptions: false, responseOptions: [] },
    { id: '2', body: "Hello Word!", sender: "system", next: 'none', wait: 10, showOptions: false, responseOptions: [] },
    { id: '10', body: "Hello Word!", sender: "player", next: '2', wait: 10, showOptions: false, responseOptions: [] },
    {
      id: '11', body: "Hello Word!", sender: "player", next: '2', wait: 1000, showOptions: true, responseOptions: [
        { id: 'r3', text: "My first response", next: '2' },
        { id: 'r4', text: "Good morning, America!", next: '2' }
      ]
    },
    //{ id: '12', body: "Hello Word!Hello Word!Hello Word!Hello Word!Hello Word!Hello Word!Hello Word!Hello Word!Hello Word!Hello Word!", sender: "player", next: '2', wait: 0, showOptions: false, responseOptions: [] },
    //{ id: '13', body: "Hello Word!Hello Word!Hello Word!Hello Word!Hello Word!Hello Word!Hello Word!Hello Word!Hello Word!Hello Word!", sender: "player", next: '2', wait: 0, showOptions: false, responseOptions: [] },
  ]

  responses: ResponseOption[] = [];

  respond(id: string): void {
    let resp: ResponseOption = this.responses.find(x => x.id == id) ?? { id: '1', text: "No no!!", next: '2' };
    this.messages.push({ id: resp.id, body: resp.text, sender: "player", next: "0", wait: 0, showOptions: false, responseOptions: [] });
    this.toggleResponseBoxVisibility();
    this.reciveMessage(resp.next);
  }

  async reciveMessage(id:string) {
    let msg: Message | undefined = this.incomingMessages.find(x => x.id == id);
    if (msg != undefined) {
      await this.delay(msg.wait);
      this.messages.push(msg);
      if (msg.showOptions) {
        this.responses = msg.responseOptions;
        this.toggleResponseBoxVisibility();
      } else {
        this.reciveMessage(msg.next);
      }
    }
  }

  toggleResponseBoxVisibility(): void {
    this.responseBoxVisible = !this.responseBoxVisible;
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  messageStyle(id: string): string {
    var style: string = "";
    var item: any = this.messages.find(x => x.id == id);
    var index: number = this.messages.indexOf(item);
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
}
