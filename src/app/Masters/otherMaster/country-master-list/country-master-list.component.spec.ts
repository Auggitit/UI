import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryMasterListComponent } from './country-master-list.component';

describe('CountryMasterListComponent', () => {
  let component: CountryMasterListComponent;
  let fixture: ComponentFixture<CountryMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryMasterListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
