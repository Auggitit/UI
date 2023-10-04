import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashPaymentCreateComponent } from './cash-payment-create.component';

describe('CashPaymentCreateComponent', () => {
  let component: CashPaymentCreateComponent;
  let fixture: ComponentFixture<CashPaymentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashPaymentCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashPaymentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
