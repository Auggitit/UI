import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteReportsComponent } from './credit-note-reports.component';

describe('CreditNoteReportsComponent', () => {
  let component: CreditNoteReportsComponent;
  let fixture: ComponentFixture<CreditNoteReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditNoteReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditNoteReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
