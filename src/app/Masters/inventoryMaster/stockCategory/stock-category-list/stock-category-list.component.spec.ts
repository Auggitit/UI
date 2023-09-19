import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCategoryListComponent } from './stock-category-list.component';

describe('StockCategoryListComponent', () => {
  let component: StockCategoryListComponent;
  let fixture: ComponentFixture<StockCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockCategoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
