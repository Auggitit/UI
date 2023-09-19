import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UomCreateComponent } from './uom-create.component';

describe('UomCreateComponent', () => {
  let component: UomCreateComponent;
  let fixture: ComponentFixture<UomCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UomCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UomCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
