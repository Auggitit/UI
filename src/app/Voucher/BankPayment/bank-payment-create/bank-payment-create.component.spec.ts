import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankPaymentCreateComponent } from './bank-payment-create.component';

describe('BankPaymentCreateComponent', () => {
  let component: BankPaymentCreateComponent;
  let fixture: ComponentFixture<BankPaymentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankPaymentCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankPaymentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
