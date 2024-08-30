import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'game-selector',
  standalone: true,
  imports: [],
  templateUrl: './game-selector.component.html',
  styleUrl: './game-selector.component.scss'
})
export class GameSelectorComponent {
  @Input() backgroundColor:string = 'white';
  @Input() slectedGame:string = '';
  @Output() selectedGameChange = new EventEmitter<string>();

  select(id:string) {
    this.selectedGameChange.emit(id);
  }
}
