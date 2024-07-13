import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { VisualNode } from '../graph/models/visualNode.model';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'list-view',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatTableModule],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss'
})
export class ListViewComponent {
  @Input() nodes: VisualNode[] = [];
}
