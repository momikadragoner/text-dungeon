import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, output, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Message } from '../../game/model/message.model';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatAccordion } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'message-list-view',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MatAccordion,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './message-list-view.component.html',
  styleUrl: './message-list-view.component.scss',
  animations: [
    trigger('arrivingMessages', [
      transition(':enter', [
        query('.arrive', [
          style({ opacity: 0, transform: 'translateY(100px)' }),
          stagger(30, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ]),
      transition(':leave', [
        query('.arrive', [
          style({ opacity: 1, transform: 'none' }),
          stagger(30, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 0, transform: 'translateY(100px)' }))
          ])
        ])
      ])
    ])
  ],
})
export class MessageListViewComponent implements OnChanges {
  @Input() messages: Message[] = [];
  @Output() pathChange = new EventEmitter<any>();
  @Output() messagesChange = new EventEmitter<Message[]>();
  @Output() openNewLoopDialogEvent = new EventEmitter<Message>();
  @Output() openEditMessageDialogEvent = new EventEmitter<Message>();
  @Output() deleteMessageEvent = new EventEmitter<{ message: Message, prev: Message }>();
  @Input() selected:string[] = [];
  @Output() selectedChange = new EventEmitter<string[]>();

  @Input() choiceForm = this.formBuilder.group({
    choices: this.formBuilder.array([]),
  });
  @Output() choiceFormChange = new EventEmitter<FormGroup>();

  get choices() {
    return this.choiceForm.get('choices') as FormArray;
  }

  colors: string[] = ['Red', 'Yellow', 'Green', 'Blue'];

  selectedMessage:string = '';

  constructor(private formBuilder: FormBuilder, private router: Router) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    let index = 0;
    const msgChange = changes['messages'];
    const optionMessages = this.messages.filter(m => m.showOptions == true);
    // for (let index = 0; index < this.choices.length; index++) {
    //   this.choices.removeAt(index);
    // }
    // console.log(changes);
    if (!msgChange.firstChange) {
      const prevValue: Message[] = msgChange.previousValue;
      const prevOptionMessgaes = prevValue.filter(m => m.showOptions == true);
      const delta = optionMessages.length - prevOptionMessgaes.length;
      if (delta > 0) {
        for (let index = delta; index > 0; index--) {
          this.addChoice(optionMessages[index].responseOptions[0].id);
        }
      } else if (delta < 0) {
        for (let index = delta; index < 0; index++) {
          this.choices.removeAt(-index);
        }
      }
    }
    else {
      optionMessages.forEach(() => {
        this.addChoice(optionMessages[index].responseOptions[0].id);
        index++;
      });
    }
  }

  addChoice(value: string) {
    this.choices.push(this.formBuilder.control(value));
  }

  onChange() {
    this.pathChange.emit(this.choiceForm.value.choices);
  }

  getRadioIndex(index: number) {
    return this.messages.filter(m => m.showOptions == true && this.messages.indexOf(m) <= index).length - 1;
  }

  onFlag(id: string, color: string) {
    const msg = this.messages.find(x => x.id == id);
    if (msg != undefined) {
      if (msg.flags == undefined) {
        msg.flags = [];
      }
      if (msg.flags.includes(color)) {
        msg.flags = msg.flags.filter(x => x != color);
      } else {
        msg.flags.push(color);
      }
    }
    this.messagesChange.emit(this.messages);
  }

  select(id:string) {
    this.selected = [id];
  }

  openDialog(message: Message) {
    this.openNewLoopDialogEvent.emit(message);
  }

  editMessage(message: Message) {
    this.openEditMessageDialogEvent.emit(message);
  }

  deleteMessage(message: Message, index: number) {
    this.deleteMessageEvent.emit({ message: message, prev: this.messages[index - 1] });
  }
}
