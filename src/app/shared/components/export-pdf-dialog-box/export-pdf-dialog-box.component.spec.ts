import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPdfDialogBoxComponent } from './export-pdf-dialog-box.component';

describe('ExportPdfDialogBoxComponent', () => {
  let component: ExportPdfDialogBoxComponent;
  let fixture: ComponentFixture<ExportPdfDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportPdfDialogBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportPdfDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
