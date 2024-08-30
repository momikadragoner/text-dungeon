import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class PhoneScreenComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {

    if ((this.hexToR(this.systemBackgroundColor) * 0.299 + this.hexToG(this.systemBackgroundColor) * 0.587 +
    this.hexToB(this.systemBackgroundColor) * 0.114) > 186) {
      this.systemColor = '#000000';
    } else {
      this.systemColor = '#ffffff';
    }
  }

  @Input() backgroundColor: string = 'darkgray';
  @Input() systemBackgroundColor: string = '#FFFFFF';
  systemColor: string = '';

  time = Date.now();

  hexToR(h: string) { return parseInt((this.cutHex(h)).substring(0, 2), 16) }
  hexToG(h: string) { return parseInt((this.cutHex(h)).substring(2, 4), 16) }
  hexToB(h: string) { return parseInt((this.cutHex(h)).substring(4, 6), 16) }
  cutHex(h: string) { return (h.charAt(0) == "#") ? h.substring(1, 7) : h }
}
