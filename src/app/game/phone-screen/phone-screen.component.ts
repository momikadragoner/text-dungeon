import { Component, Input } from '@angular/core';
import { MessagesComponent } from "../messages/messages.component";
import { DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'phone-screen',
  standalone: true,
  imports: [MessagesComponent, DatePipe, RouterOutlet],
  templateUrl: './phone-screen.component.html',
  styleUrl: './phone-screen.component.scss'
})
export class PhoneScreenComponent {
  @Input() backgroundColor:string = 'darkgray';
  @Input() systemBackgroundColor:string = 'white';

  time = Date.now();
}
