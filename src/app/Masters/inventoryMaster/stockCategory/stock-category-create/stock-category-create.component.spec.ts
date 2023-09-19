import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCategoryCreateComponent } from './stock-category-create.component';

describe('StockCategoryCreateComponent', () => {
  let component: StockCategoryCreateComponent;
  let fixture: ComponentFixture<StockCategoryCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockCategoryCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockCategoryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
