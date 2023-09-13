import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorComponentComponent } from './vendor-component.component';

describe('VendorComponentComponent', () => {
  let component: VendorComponentComponent;
  let fixture: ComponentFixture<VendorComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
