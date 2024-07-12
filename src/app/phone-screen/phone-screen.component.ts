import { Component } from '@angular/core';
import { MessagesComponent } from "../messages/messages.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-phone-screen',
  standalone: true,
  imports: [MessagesComponent, DatePipe],
  templateUrl: './phone-screen.component.html',
  styleUrl: './phone-screen.component.scss'
})
export class PhoneScreenComponent {
  time = Date.now();
}
