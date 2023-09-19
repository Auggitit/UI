import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockItemCreateComponent } from './stock-item-create.component';

describe('StockItemCreateComponent', () => {
  let component: StockItemCreateComponent;
  let fixture: ComponentFixture<StockItemCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockItemCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockItemCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
