import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashReceiptListComponent } from './cash-receipt-list.component';

describe('CashReceiptListComponent', () => {
  let component: CashReceiptListComponent;
  let fixture: ComponentFixture<CashReceiptListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashReceiptListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashReceiptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
