import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesListsComponent } from './sales-lists.component';

describe('SalesListsComponent', () => {
  let component: SalesListsComponent;
  let fixture: ComponentFixture<SalesListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesListsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
