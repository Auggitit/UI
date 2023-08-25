import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitNoteDetailsComponent } from './debit-note-details.component';

describe('DebitNoteDetailsComponent', () => {
  let component: DebitNoteDetailsComponent;
  let fixture: ComponentFixture<DebitNoteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitNoteDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitNoteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
