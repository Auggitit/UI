import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSalesOrderDetailsComponent } from './service-sales-order-details.component';

describe('ServiceSalesOrderDetailsComponent', () => {
  let component: ServiceSalesOrderDetailsComponent;
  let fixture: ComponentFixture<ServiceSalesOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceSalesOrderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceSalesOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
