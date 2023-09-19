import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UomListComponent } from './uom-list.component';

describe('UomListComponent', () => {
  let component: UomListComponent;
  let fixture: ComponentFixture<UomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UomListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
