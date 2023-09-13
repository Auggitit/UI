import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesLayoutMidComponent } from './sales-layout-mid.component';

describe('SalesLayoutMidComponent', () => {
  let component: SalesLayoutMidComponent;
  let fixture: ComponentFixture<SalesLayoutMidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesLayoutMidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesLayoutMidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
