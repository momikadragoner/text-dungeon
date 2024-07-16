import { Injectable } from '@angular/core';
import { Message } from '../model/message.model';
import { Node } from '../../graph/models/node.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  messageToNode(msg: Message): Node {
    const edges: string[] = [];
    if (msg.showOptions) {
      msg.responseOptions.forEach(r => {
        edges.push(r.id);
      });
    } else {
      if (msg.next != undefined) {
        edges.push(msg.next);
      }
    }
    return { id: msg.id, edges: edges };
  }

  gameTreeToGraph(gameTree:Message[]):Node[] {
    return gameTree.map(x => this.messageToNode(x));
  }
}
