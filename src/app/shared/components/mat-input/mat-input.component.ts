import { Component, Input, OnInit } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mat-input',
  templateUrl: './mat-input.component.html',
  styleUrls: ['./mat-input.component.scss'],
})
export class MatInputComponent implements OnInit {
  @Input() labelText: string = 'Label Name';
  @Input() inputType: string = 'text';
  @Input() placeholderText: string = 'Label Text';
  @Input() groupName!: FormGroup;
  @Input() controlName!: FormControlName | any;
  @Input() modelName: any;
  @Input() isRequired: boolean = true;
  value: any = 'values';

  constructor() {}

  ngOnInit(): void {
    console.log('iside input', this.groupName);
  }
}
