import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePoDetailsComponent } from './service-po-details.component';

describe('ServicePoDetailsComponent', () => {
  let component: ServicePoDetailsComponent;
  let fixture: ComponentFixture<ServicePoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicePoDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicePoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
