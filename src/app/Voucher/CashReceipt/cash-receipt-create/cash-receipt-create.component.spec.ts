import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashReceiptCreateComponent } from './cash-receipt-create.component';

describe('CashReceiptCreateComponent', () => {
  let component: CashReceiptCreateComponent;
  let fixture: ComponentFixture<CashReceiptCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashReceiptCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashReceiptCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
