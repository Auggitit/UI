import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryMasterCreateComponent } from './country-master-create.component';

describe('CountryMasterCreateComponent', () => {
  let component: CountryMasterCreateComponent;
  let fixture: ComponentFixture<CountryMasterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryMasterCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryMasterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
