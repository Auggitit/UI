import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingTableDialogComponent } from './listing-table-dialog.component';

describe('ListingTableDialogComponent', () => {
  let component: ListingTableDialogComponent;
  let fixture: ComponentFixture<ListingTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingTableDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
