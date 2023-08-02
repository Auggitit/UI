import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-reports-header',
  templateUrl: './reports-header.component.html',
})
export class ReportsHeaderComponent implements OnInit, OnChanges {
  @Input() title!: String;
  @Input() filterByOptions!: { name: string; id: string | number }[];
  @Input() saveTypesOptions!: { name: string; id: string | number }[];
  @Input() reportFormGroupName!: FormGroup;
  @Input() SelectSaveOptions!: FormControlName | any;
  @Input() filterData!: FormControlName | any;
  @Input() svgIconToDisplay!: string;
  @Input() isReports: boolean = true;
  @Input() buttonTitle: string = 'Create New Order';
  @Output() onClickDownload = new EventEmitter();
  @Output() onClickGoto = new EventEmitter();
  @Output() onClickCreateButton = new EventEmitter();

  isIconNeeded: boolean = true;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'ReportsIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/reportsIcon.svg'
      )
    );
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {}

  clickDownload(event: any) {
    console.log(event);
    this.onClickDownload.emit(event);
  }

  OnClickButton(event: any) {
    console.log(event);
    this.onClickCreateButton.emit(event);
  }

  gotoReports(event: any) {
    this.onClickGoto.emit(event);
  }
}
