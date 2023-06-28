import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mat-button',
  template: `
    <button
      mat-raised-button
      [ngStyle]="{
        'background-color': buttonColor,
        'font-size': titleFontSize,
        color: textColor,
        'font-weight': titleFontWeight,
        padding: paddingValue,
        'max-width': maximumWidth,
        'min-width': 'unset',
        height: buttonHeight,
        'border-radius': '8px',
        border: borderValues,
        marginLeft: '4px',
        marginRight: '4px',
        width:buttonWidth
      }"
      (click)="onClick($event)"
    >
      <i
        *ngIf="icon"
        class="{{ icon }} fa-lg "
        style="color:{{ iconColor }}"
      ></i>

      <mat-icon 
        style="width: 14px;vertical-align:revert;line-height:30px;" 
        *ngIf="svgIconToDisplay" 
        [svgIcon]="svgIconToDisplay">
      </mat-icon>
      {{ title }}
    </button>
  `,
})
export class MatButtonComponent implements OnInit {
  @Input() title!: string;
  @Output() onClickButton = new EventEmitter();
  @Input() buttonColor: string = '#FFFFFF';
  @Input() textColor: string = '#000000';
  @Input() titleFontSize: string = '14px';
  @Input() titleFontWeight: number | string = 500;
  @Input() icon!: string;
  @Input() paddingValue: string = '0px 15px 0px 10px';
  @Input() maximumWidth: string = '200px';
  @Input() buttonHeight: string = '80px';
  @Input() iconColor: string = '#667085';
  @Input() borderValues: string = '0px';
  @Input() svgIconToDisplay!:string;
  @Input() buttonWidth!:string;


  constructor() {}

  onClick(event: any): void {
    this.onClickButton.emit(event);
  }
  ngOnInit(): void {}
}
