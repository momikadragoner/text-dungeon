import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from '../game/model/message.model';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatAccordion } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'message-list-view',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MatAccordion,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  templateUrl: './message-list-view.component.html',
  styleUrl: './message-list-view.component.scss'
})
export class MessageListViewComponent implements OnChanges {
  @Input() messages: Message[] = [];
  @Output() pathChange =  new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder) { }
  ngOnChanges(changes: SimpleChanges): void {
    let index = 0;
    const optionMessages = this.messages.filter(m => m.showOptions == true)
    optionMessages.forEach(() => {
      this.addChoice(optionMessages[index].responseOptions[0].id);
      index++;
    });
  }

  ngOnInit(): void {
  }

  choiceForm = this.formBuilder.group({
    choices: this.formBuilder.array([]),
  });

  get choices() {
    return this.choiceForm.get('choices') as FormArray;
  }

  addChoice(value:string) {
    this.choices.push(this.formBuilder.control(value));
  }

  onChange() {
    this.pathChange.emit(this.choiceForm.value.choices);
  }

  getRadioIndex(index: number) {
    return this.messages.filter(m => m.showOptions == true && this.messages.indexOf(m) <= index).length - 1;
  }
}
