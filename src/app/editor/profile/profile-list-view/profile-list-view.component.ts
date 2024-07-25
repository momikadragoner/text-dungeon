import { Component, Input } from '@angular/core';
import { ContactProfile } from '../../../game/model/profile.model';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'profile-list-view',
  standalone: true,
  imports: [MatDividerModule, MatListModule],
  templateUrl: './profile-list-view.component.html',
  styleUrl: './profile-list-view.component.scss'
})
export class ProfileListViewComponent {
  @Input() profiles:ContactProfile[] = []
}
