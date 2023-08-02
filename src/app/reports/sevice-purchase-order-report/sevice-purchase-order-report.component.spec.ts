import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SevicePurchaseOrderReportComponent } from './sevice-purchase-order-report.component';

describe('SevicePurchaseOrderReportComponent', () => {
  let component: SevicePurchaseOrderReportComponent;
  let fixture: ComponentFixture<SevicePurchaseOrderReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SevicePurchaseOrderReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SevicePurchaseOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
