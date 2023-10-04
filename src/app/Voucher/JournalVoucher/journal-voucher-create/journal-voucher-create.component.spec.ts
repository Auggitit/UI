import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalVoucherCreateComponent } from './journal-voucher-create.component';

describe('JournalVoucherCreateComponent', () => {
  let component: JournalVoucherCreateComponent;
  let fixture: ComponentFixture<JournalVoucherCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalVoucherCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalVoucherCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
