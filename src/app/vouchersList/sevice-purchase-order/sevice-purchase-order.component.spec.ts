import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SevicePurchaseOrderComponent } from './sevice-purchase-order.component';

describe('SevicePurchaseOrderComponent', () => {
  let component: SevicePurchaseOrderComponent;
  let fixture: ComponentFixture<SevicePurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SevicePurchaseOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SevicePurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
