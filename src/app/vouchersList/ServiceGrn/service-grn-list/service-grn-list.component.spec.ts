import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceGrnListComponent } from './service-grn-list.component';

describe('ServiceGrnListComponent', () => {
  let component: ServiceGrnListComponent;
  let fixture: ComponentFixture<ServiceGrnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceGrnListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceGrnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
