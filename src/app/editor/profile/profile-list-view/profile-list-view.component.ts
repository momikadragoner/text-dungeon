import { Component, Input } from '@angular/core';
import { ContactProfile } from '../../../game/model/profile.model';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'profile-list-view',
  standalone: true,
  imports: [MatDividerModule, MatListModule, MatExpansionModule, MatCardModule],
  templateUrl: './profile-list-view.component.html',
  styleUrl: './profile-list-view.component.scss'
})
export class ProfileListViewComponent {
  @Input() profiles:ContactProfile[] = []
}
