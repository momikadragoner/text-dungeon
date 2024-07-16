import { Component, Input } from '@angular/core';
import { Message } from '../game/model/message.model';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatAccordion } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'message-list-view',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MatAccordion,
    MatButtonModule
  ],
  templateUrl: './message-list-view.component.html',
  styleUrl: './message-list-view.component.scss'
})
export class MessageListViewComponent {
  @Input() messages: Message[] = [];

}
