import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendortableComponent } from './vendortable.component';

describe('VendortableComponent', () => {
  let component: VendortableComponent;
  let fixture: ComponentFixture<VendortableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendortableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendortableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
