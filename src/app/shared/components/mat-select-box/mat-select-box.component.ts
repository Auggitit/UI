import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'app-mat-select-box',
  template: `<form
    *ngIf="formOptions?.length && groupName && formAppearance"
    [formGroup]="groupName"
    class="p-0 m-0"
  >
    <mat-form-field
      [appearance]="formAppearance"
      [ngStyle]="{
        width: selectWidth,
        'padding-left': '4px',
        'padding-right': '4px'
      }"
    >
      <mat-label style="font-size:14px;color:#667085;font-weight:400">{{
        label
      }}</mat-label>
      <span matPrefix>
        <mat-icon
          *ngIf="iconNeeded"
          [ngStyle]="{
            'padding-right': paddingIconRight,
            color: '#667085',
            height: IconHeightWidth,
            width: IconHeightWidth
          }"
          svgIcon="{{ Icon }}"
        ></mat-icon>
      </span>
      <mat-select
        [formControlName]="controlName"
        [ngStyle]="{
          ' min-width': ' unset!important',
          'font-weight': 500,
          color: '#667085',
          'font-size': '15px'
        }"
      >
        <ng-container>
          <mat-option *ngFor="let item of formOptions" [value]="item.id">
            {{ item.name }}</mat-option
          >
        </ng-container>
      </mat-select>

      <span matSuffix> <mat-icon svgIcon="arrowDown"></mat-icon></span>
    </mat-form-field>
  </form>`,
})
export class MatSelectBoxComponent implements OnInit, OnChanges {
  @Input() formAppearance: MatFormFieldAppearance = 'outline';
  @Input('label') label: string = 'Select';
  @Input() controlName: any;
  @Input() groupName: any;
  @Input() formOptions!: { name: string; id: string | number }[];
  @Input() iconNeeded: boolean = false;
  @Input() Icon: string = '';
  @Input() selectWidth: string = '100%';
  @Input() IconHeightWidth: string = '24px';
  @Input() paddingIconRight: string = '8px';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {}
}
