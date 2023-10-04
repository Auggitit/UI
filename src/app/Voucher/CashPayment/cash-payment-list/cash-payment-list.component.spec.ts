import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashPaymentListComponent } from './cash-payment-list.component';

describe('CashPaymentListComponent', () => {
  let component: CashPaymentListComponent;
  let fixture: ComponentFixture<CashPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashPaymentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
