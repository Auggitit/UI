import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableColumnDisplayFilterComponent } from './table-column-display-filter.component';

describe('TableColumnDisplayFilterComponent', () => {
  let component: TableColumnDisplayFilterComponent;
  let fixture: ComponentFixture<TableColumnDisplayFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableColumnDisplayFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableColumnDisplayFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
