import { Component, Input } from '@angular/core';
import { PhoneScreenComponent } from "../phone-screen/phone-screen.component";
import { MessagesComponent } from "../messages/messages.component";
import { GameSelectorComponent } from "../game-selector/game-selector.component";

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [PhoneScreenComponent, MessagesComponent, GameSelectorComponent],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})
export class GamePageComponent {
  @Input() backgroundColor:string = '#3B5249';
  gameSelectMenuOpen:boolean = true;
  selectedGame:string = '';

  select(selectedGame:string) {
    this.selectedGame = selectedGame;
    this.backgroundColor = 'white';
    this.gameSelectMenuOpen = false;
  }
}
