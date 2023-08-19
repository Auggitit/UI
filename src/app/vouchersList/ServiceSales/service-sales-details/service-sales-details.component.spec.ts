import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSalesDetailsComponent } from './service-sales-details.component';

describe('ServiceSalesDetailsComponent', () => {
  let component: ServiceSalesDetailsComponent;
  let fixture: ComponentFixture<ServiceSalesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceSalesDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceSalesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
