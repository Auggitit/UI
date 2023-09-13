import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitnoteupdateComponent } from './debitnoteupdate.component';

describe('DebitnoteupdateComponent', () => {
  let component: DebitnoteupdateComponent;
  let fixture: ComponentFixture<DebitnoteupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitnoteupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitnoteupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
