import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphVisualComponent } from './graph-visual.component';

describe('GraphVisualComponent', () => {
  let component: GraphVisualComponent;
  let fixture: ComponentFixture<GraphVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphVisualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
