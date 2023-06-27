import { Component, OnInit, Input } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-table-filters',
  templateUrl: './table-filters.component.html',
  styleUrls: ['./table-filters.component.scss'],
})
export class TableFiltersComponent implements OnInit {
  @Input() StatusOptions!: { name: string; id: string | number }[];
  @Input() vendorDropDownData!: { name: string; id: string | number }[];
  @Input() tableFiltersGroupName!: FormGroup;
  isIconNeeded: boolean = true;
  @Input() searchSuggestionsList: string[] = [];
  @Input() reportStatus!: FormControlName | any;
  @Input() vendorcode!: FormControlName | any;
  constructor() {}

  ngOnInit(): void {}
}
