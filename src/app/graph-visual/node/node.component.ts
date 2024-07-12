import { Component, Input } from '@angular/core';

@Component({
  selector: 'node',
  standalone: true,
  imports: [],
  templateUrl: './node.component.html',
  styleUrl: './node.component.scss'
})
export class NodeComponent {
  @Input() x?:string = '0px';
  @Input() y?:string = '0px';
  @Input() width?:string = '100px';
  @Input() height?:string = '100px';
  @Input() classList?:string = '';
  @Input() text?:string = '';
}
