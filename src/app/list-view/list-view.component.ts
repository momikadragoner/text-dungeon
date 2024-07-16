import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { VisualNode } from '../graph/models/visualNode.model';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { VisualEdge } from '../graph/models/visualEdge.model';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'list-view',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatTooltipModule,
    MatExpansionModule,
    MatListModule,
  ],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss'
})
export class ListViewComponent {
  @Input() visualNodes: VisualNode[] = [];
  @Input() visualEdges: VisualEdge[] = [];
}
