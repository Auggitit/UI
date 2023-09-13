import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditnotelistComponent } from './creditnotelist.component';

describe('CreditnotelistComponent', () => {
  let component: CreditnotelistComponent;
  let fixture: ComponentFixture<CreditnotelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditnotelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditnotelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
