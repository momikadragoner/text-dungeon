import { Component, inject, OnChanges, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProfileFormComponent } from "../../profile/profile-form/profile-form.component";
import { ContactProfile } from '../../../game/model/profile.model';
import { ProfileDialogData } from '../models/profileDialogData.model';

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ProfileFormComponent],
  templateUrl: './profile-dialog.component.html',
  styleUrl: './profile-dialog.component.scss'
})
export class ProfileDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ProfileDialogComponent>);
  readonly data = inject<ProfileDialogData>(MAT_DIALOG_DATA);

  profile?:ContactProfile;

  constructor() {
    this.profile = this.data.profile;
  }

  onSaveClick() {
    console.log(this.profile);
    let result = this.profile;
    this.dialogRef.close(result);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
