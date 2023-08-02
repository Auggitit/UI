import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceGrnReportComponent } from './service-grn-report.component';

describe('ServiceGrnReportComponent', () => {
  let component: ServiceGrnReportComponent;
  let fixture: ComponentFixture<ServiceGrnReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceGrnReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceGrnReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
