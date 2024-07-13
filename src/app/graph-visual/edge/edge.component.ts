import { Component, Input } from '@angular/core';

@Component({
  selector: 'edge',
  standalone: true,
  imports: [],
  templateUrl: './edge.component.html',
  styleUrl: './edge.component.scss'
})
export class EdgeComponent {
  @Input() id:string = '';
  @Input() pathDefinition?:string = 'M 100 350 q 150 -300 300 0';
  @Input() strokeColor?:string = 'black';
  @Input() strokeWidth?:string = '4';
  @Input() fillColor?:string = 'none';
}
