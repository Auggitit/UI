import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateMasterCreateComponent } from './state-master-create.component';

describe('StateMasterCreateComponent', () => {
  let component: StateMasterCreateComponent;
  let fixture: ComponentFixture<StateMasterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateMasterCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateMasterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
