import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnCreateComponent } from './hsn-create.component';

describe('HsnCreateComponent', () => {
  let component: HsnCreateComponent;
  let fixture: ComponentFixture<HsnCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsnCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HsnCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
