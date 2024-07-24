import { Injectable } from '@angular/core';
import { Message } from '../model/message.model';
import { ResponseOption } from '../model/response.model';

@Injectable({
  providedIn: 'root'
})
export class MessageTreeService {

  constructor() { }

  private _messageTree: Message[] = [];
  private counter: number = 0;

  get messageTree() {
    return this._messageTree;
  }

  set messageTree(value: Message[]) {
    this._messageTree = value;
  }

  get responseOptions(): ResponseOption[] {
    return this._messageTree.filter(x => x.showOptions).reduce((a: ResponseOption[], b) => a.concat(b.responseOptions), []);
  }

  getMessageById(id: string): Message | undefined {
    return this._messageTree.find(x => x.id == id);
  }

  getResponseOptionById(id: string): ResponseOption | undefined {
    return this.responseOptions.find(x => x.id == id);
  }

  private addMessageAfterMessage(newMessage: Message, prevMessage: Message): boolean {
    prevMessage.next = newMessage.id;
    this._messageTree.push(newMessage);
    return true;
  }

  private addMessageAfterOption(newMessage: Message, prevId: string): boolean {
    let prevOption = this.getResponseOptionById(prevId);
    if (prevOption == undefined) return false;
    prevOption.next = newMessage.id;
    this._messageTree.push(newMessage);
    return true;
  }

  private getNextMessageId(): string {
    if (this.counter == 0) {
      this.counter = this._messageTree.length;
    }
    while (this.getMessageById(String(this.counter)) != undefined) {
      this.counter++;
    }
    return String(this.counter);
  }

  addMessage(newMessage: Message, prevMessageId?: string, selectedOptions?: string[]): boolean {
    newMessage.id = this.getNextMessageId();
    if (prevMessageId == undefined) {
      if (this.messageTree.length == 0) {
        this._messageTree.push(newMessage);
        return true;
      } else return false;
    }
    let prevMessage = this.getMessageById(prevMessageId);
    if (prevMessage == undefined) return false;
    if (prevMessage.showOptions) {
      if ( selectedOptions == undefined) return false;
      let prevOptionId = prevMessage.responseOptions.filter(x => selectedOptions.includes(x.id))[0]?.id;
      if (prevOptionId == undefined) return false;
      return this.addMessageAfterOption(newMessage, prevOptionId)
    } else {
      return this.addMessageAfterMessage(newMessage, prevMessage);
    }
  }

  addOption(newOption: ResponseOption, prevMessageId: string): string | undefined {
    let prevMessage = this.getMessageById(prevMessageId);
    if (prevMessage == undefined) return undefined;
    prevMessage.showOptions = true;
    let id = prevMessage.responseOptions.length;
    while (this.getResponseOptionById(`${prevMessageId}-${id}`) != undefined) {
      id++;
    }
    newOption.id = `${prevMessageId}-${id}`;
    prevMessage.responseOptions.push(newOption);
    return newOption.id;
  }

  deleteMessage(message: Message, prevMessgageId: string, selectedResponseOptions: string[]) {
    let prev = this.messageTree.find(x => x.id == prevMessgageId);
    if (prev == undefined) return false;

    if (message.showOptions) {
      const option = message.responseOptions.find(x => selectedResponseOptions.includes(x.id))
      if (option != undefined) {
        const index = message.responseOptions.indexOf(option)
        message.next = message.responseOptions[index].next;
      }
    }
    if (prev.showOptions) {
      const option = prev.responseOptions.find(x => selectedResponseOptions.includes(x.id))
      if (option == undefined) return false;
      const index = prev.responseOptions.indexOf(option)
      prev.responseOptions[index].next = message.next;
    } else {
      prev.next = message.next;
    }

    const index = this.messageTree.indexOf(message);
    if (index > -1) {
      this.messageTree.splice(index, 1);
      return true;
    }
    return false;
  }

  getNodeById(id: string) {
    let msg = this.getMessageById(id);
    let option = this.getResponseOptionById(id);
    let node;
    if (msg != undefined) node = msg;
    if (option != undefined) node = option;
    if (node == undefined) throw new Error();
    return node;
  }

  addLink(startId: string, endId: string) {
    let start = this.getNodeById(startId);
    start.next = endId;
  }

  deleteLink(startId: string) {
    let start = this.getNodeById(startId);
    start.next = undefined;
  }

  editMessage(editedMessage: Message) {
    let message = this.getMessageById(editedMessage.id);
    message = editedMessage;
  }

  takeMessagePath(choices: string[]): Message[] {
    if (this._messageTree.length == 0) {
      return [];
    }
    const orderedMessagePath: Message[] = [];
    let index = 0;
    let node: Message | undefined = this._messageTree[0]
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
      node = this._messageTree.find(x => x.id == next);
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

}
