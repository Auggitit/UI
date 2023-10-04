import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankReceiptCreateComponent } from './bank-receipt-create.component';

describe('BankReceiptCreateComponent', () => {
  let component: BankReceiptCreateComponent;
  let fixture: ComponentFixture<BankReceiptCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankReceiptCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankReceiptCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
