import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankReceiptListComponent } from './bank-receipt-list.component';

describe('BankReceiptListComponent', () => {
  let component: BankReceiptListComponent;
  let fixture: ComponentFixture<BankReceiptListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankReceiptListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankReceiptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
