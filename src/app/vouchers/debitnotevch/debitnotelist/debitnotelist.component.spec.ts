import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitnotelistComponent } from './debitnotelist.component';

describe('DebitnotelistComponent', () => {
  let component: DebitnotelistComponent;
  let fixture: ComponentFixture<DebitnotelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitnotelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitnotelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
