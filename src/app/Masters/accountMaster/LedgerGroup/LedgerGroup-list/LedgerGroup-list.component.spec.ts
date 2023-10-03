import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerGroupListComponent } from './LedgerGroup-list.component';

describe('HsnListComponent', () => {
  let component: LedgerGroupListComponent;
  let fixture: ComponentFixture<LedgerGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerGroupListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedgerGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
