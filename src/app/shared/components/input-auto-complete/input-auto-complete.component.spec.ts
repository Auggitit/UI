import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAutoCompleteComponent } from './input-auto-complete.component';

describe('InputAutoCompleteComponent', () => {
  let component: InputAutoCompleteComponent;
  let fixture: ComponentFixture<InputAutoCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputAutoCompleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
