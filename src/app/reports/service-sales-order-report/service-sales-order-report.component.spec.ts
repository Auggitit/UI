import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSalesOrderReportComponent } from './service-sales-order-report.component';

describe('ServiceSalesOrderReportComponent', () => {
  let component: ServiceSalesOrderReportComponent;
  let fixture: ComponentFixture<ServiceSalesOrderReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceSalesOrderReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceSalesOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
