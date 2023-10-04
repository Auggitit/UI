import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraVoucherCreateComponent } from './contra-voucher-create.component';

describe('ContraVoucherCreateComponent', () => {
  let component: ContraVoucherCreateComponent;
  let fixture: ComponentFixture<ContraVoucherCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContraVoucherCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContraVoucherCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
