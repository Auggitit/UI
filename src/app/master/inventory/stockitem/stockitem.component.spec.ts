import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockitemComponent } from './stockitem.component';

describe('StockitemComponent', () => {
  let component: StockitemComponent;
  let fixture: ComponentFixture<StockitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockitemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
