import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockGroupCreateComponent } from './stock-group-create.component';

describe('StockGroupCreateComponent', () => {
  let component: StockGroupCreateComponent;
  let fixture: ComponentFixture<StockGroupCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockGroupCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockGroupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
