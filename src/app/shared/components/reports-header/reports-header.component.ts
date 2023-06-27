import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';

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

  isIconNeeded: boolean = true;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {}
}
