import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitNoteReportComponent } from './debit-note-report.component';

describe('DebitNoteReportComponent', () => {
  let component: DebitNoteReportComponent;
  let fixture: ComponentFixture<DebitNoteReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitNoteReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitNoteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
