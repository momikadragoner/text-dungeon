import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Message } from '../../game/model/message.model';
import { ResponseOption } from '../../game/model/response.model';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'message-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatAccordion
  ],
  templateUrl: './message-form.component.html',
  styleUrl: './message-form.component.scss'
})
export class MessageFormComponent {
  messageForm = new FormGroup({
    body: new FormControl('', Validators.required,),
    sender: new FormControl('', Validators.required),
    wait: new FormControl(0),
  })

  @Input() message?:Message;
  @Output() messageChange = new EventEmitter<Message>();

  @Output() newResponseOption = new EventEmitter<ResponseOption>();

  onSubmit() {
    if(!this.messageForm.valid) return;
    const formValue = this.messageForm.value;
    if (formValue.sender == undefined || formValue.body == undefined) {
      throw new Error();
    }
    if (formValue.sender == 'player') {
      const rp:ResponseOption = {
        id: '',
        text: formValue.body,
        next: undefined
      };
      this.newResponseOption.emit(rp);
    } 
    else {
      this.message = {
        id: '',
        sender: formValue.sender,
        body: formValue.body,
        next: undefined,
        wait: formValue.wait ?? 0,
        showOptions: false,
        responseOptions: [],
        knowledge: undefined
      };
      this.messageChange.emit(this.message);
    }
    this.messageForm.patchValue({body: ''});
  }

  onSenderChange(e:any) {
    if (e == 'player') {
      this.messageForm.get("wait")?.disable();
    }
    else {
      this.messageForm.get("wait")?.enable();
    }
  }
}
