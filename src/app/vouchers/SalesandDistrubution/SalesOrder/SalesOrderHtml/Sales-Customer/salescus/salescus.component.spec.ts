import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalescusComponent } from './salescus.component';

describe('SalescusComponent', () => {
  let component: SalescusComponent;
  let fixture: ComponentFixture<SalescusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalescusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalescusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
