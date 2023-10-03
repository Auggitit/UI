import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerGroupCreateComponent } from './LedgerGroup-create.component';

describe('LedgerGroupCreateComponent', () => {
  let component: LedgerGroupCreateComponent;
  let fixture: ComponentFixture<LedgerGroupCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerGroupCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedgerGroupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
