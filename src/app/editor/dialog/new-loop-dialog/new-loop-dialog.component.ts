import { Component, ElementRef, inject, model, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatListModule, SelectionList } from '@angular/material/list';
import { NewLoopDialogData } from '../models/newLoopDialogData.model';
import { Message } from '../../../game/model/message.model';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'new-loop-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatListModule, MatChipsModule],
  templateUrl: './new-loop-dialog.component.html',
  styleUrl: './new-loop-dialog.component.scss'
})
export class NewLoopDialogComponent {
  readonly dialogRef = inject(MatDialogRef<NewLoopDialogComponent>);
  readonly data = inject<NewLoopDialogData>(MAT_DIALOG_DATA);
  readonly tree:Message[] = this.data.tree;
  @ViewChild('messages') messagesList?:SelectionList;

  closeDialog() {
    const result = this.messagesList?.selectedOptions.hasValue() ? this.messagesList?.selectedOptions.selected[0].value : undefined;
    this.dialogRef.close(result);
  }

  
  onCancelClick(): void {
    this.dialogRef.close();
  }
}
