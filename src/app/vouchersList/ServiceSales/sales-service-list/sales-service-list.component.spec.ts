import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesServiceListComponent } from './sales-service-list.component';

describe('SalesServiceListComponent', () => {
  let component: SalesServiceListComponent;
  let fixture: ComponentFixture<SalesServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesServiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
