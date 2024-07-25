import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ContactProfile } from '../../../game/model/profile.model';

@Component({
  selector: 'profile-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatChipsModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss'
})
export class ProfileFormComponent implements OnInit {

  @Input() profile?: ContactProfile;
  @Output() profileChange = new EventEmitter<ContactProfile>();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.profileForm.valueChanges.subscribe(value => this.onFormChange(value));
  }

  profileForm = this.formBuilder.group({
    username: ['', Validators.required],
    fullName: [''],
    color: ['blue'],
    pictureUrl: [''],
    description: ['']
  })

  onFormChange(formValue:any) {
    this.profile = {
      id: formValue.username ?? '',
      username: formValue.username ?? '',
      fullName: formValue.fullName ?? '',
      color: formValue.color ?? '',
      pictureUrl: formValue.pictureUrl ?? '',
      description: formValue.description ?? ''
    }
    this.profileChange.emit(this.profile);
  }
}
