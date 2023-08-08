import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSalesOrderListComponent } from './service-sales-order-list.component';

describe('ServiceSalesOrderListComponent', () => {
  let component: ServiceSalesOrderListComponent;
  let fixture: ComponentFixture<ServiceSalesOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceSalesOrderListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceSalesOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
