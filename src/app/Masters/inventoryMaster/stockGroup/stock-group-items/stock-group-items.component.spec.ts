import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockGroupItemsComponent } from './stock-group-items.component';

describe('StockGroupItemsComponent', () => {
  let component: StockGroupItemsComponent;
  let fixture: ComponentFixture<StockGroupItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockGroupItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockGroupItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
