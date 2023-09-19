import { Component, Input, OnInit } from '@angular/core';
import { FormControlName } from '@angular/forms';

@Component({
  selector: 'app-mat-input',
  templateUrl: './mat-input.component.html',
  styleUrls: ['./mat-input.component.scss'],
})
export class MatInputComponent implements OnInit {
  @Input() labelText: string = 'Label Name';
  @Input() placeholderText: string = 'Label Text';
  @Input() formControlName!: FormControlName | any;
  @Input() modelName: any;
  @Input() isRequired: boolean = true;
  value: any = 'values';

  constructor() {}

  ngOnInit(): void {}
}
