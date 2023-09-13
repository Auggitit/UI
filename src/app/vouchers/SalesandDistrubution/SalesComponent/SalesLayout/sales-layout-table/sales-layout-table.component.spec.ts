import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesLayoutTableComponent } from './sales-layout-table.component';

describe('SalesLayoutTableComponent', () => {
  let component: SalesLayoutTableComponent;
  let fixture: ComponentFixture<SalesLayoutTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesLayoutTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesLayoutTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
