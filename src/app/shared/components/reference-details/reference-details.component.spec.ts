import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDetailsComponent } from './reference-details.component';

describe('ReferenceDetailsComponent', () => {
  let component: ReferenceDetailsComponent;
  let fixture: ComponentFixture<ReferenceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferenceDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
