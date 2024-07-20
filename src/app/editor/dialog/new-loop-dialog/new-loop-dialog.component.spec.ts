import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoopDialogComponent } from './new-loop-dialog.component';

describe('NewLoopDialogComponent', () => {
  let component: NewLoopDialogComponent;
  let fixture: ComponentFixture<NewLoopDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLoopDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLoopDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
