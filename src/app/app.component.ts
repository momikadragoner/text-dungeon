import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { PhoneScreenComponent } from './phone-screen/phone-screen.component';
import { MessagesComponent } from './messages/messages.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    MatSlideToggleModule, 
    NavBarComponent, 
    PhoneScreenComponent, 
    MessagesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'text-dungeon';
}
