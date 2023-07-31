import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesServiceReportComponent } from './sales-service-report.component';

describe('SalesServiceReportComponent', () => {
  let component: SalesServiceReportComponent;
  let fixture: ComponentFixture<SalesServiceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesServiceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesServiceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
