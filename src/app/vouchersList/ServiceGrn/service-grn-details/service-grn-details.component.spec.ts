import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceGrnDetailsComponent } from './service-grn-details.component';

describe('ServiceGrnDetailsComponent', () => {
  let component: ServiceGrnDetailsComponent;
  let fixture: ComponentFixture<ServiceGrnDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceGrnDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceGrnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
