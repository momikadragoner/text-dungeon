import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Message } from '../../../game/model/message.model';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAccordion } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ContactProfile } from '../../../game/model/profile.model';

@Component({
  selector: 'app-edit-message-dialog',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatButtonModule, MatAccordion, MatCheckboxModule],
  templateUrl: './edit-message-dialog.component.html',
  styleUrl: './edit-message-dialog.component.scss'
})
export class EditMessageDialogComponent {

  readonly dialogRef = inject(MatDialogRef<EditMessageDialogComponent>);
  readonly data = inject<EditMessageDialogComponent>(MAT_DIALOG_DATA);
  readonly formBuilder = inject(FormBuilder);
  readonly tree: Message[] = this.data.tree;
  readonly profiles: ContactProfile[] = this.data.profiles;
  get message(): Message { return this.data.message }

  messageForm = this.formBuilder.group({
    body: [this.message.body, Validators.required],
    sender: [this.message.sender, Validators.required],
    wait: [this.message.wait, Validators.required],
    next: [this.message.next],
    showOptions: [this.message.showOptions],
    responseOptions: this.formBuilder.array([
      this.formBuilder.group({
        text: [this.message.responseOptions[0].text]
      })
    ])
  })

  onSaveClick() {
    let result: Message = this.message;
    if (this.messageForm.valid) {
      result.body = this.messageForm.value.body ?? result.body;
      result.sender = this.messageForm.value.sender ?? result.sender;
      result.wait = this.messageForm.value.wait ?? result.wait;
      result.next = this.messageForm.value.next == 'undefined' ? undefined : this.messageForm.value.next ?? undefined;
    } else return;
    this.dialogRef.close(result);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
