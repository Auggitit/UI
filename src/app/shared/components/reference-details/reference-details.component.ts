import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reference-details',
  templateUrl: './reference-details.component.html',
  styleUrls: ['./reference-details.component.scss'],
})
export class ReferenceDetailsComponent implements OnInit {
  @Input() refNumber: string = '';
  @Input() totalCount: number = 0;
  constructor() {}

  ngOnInit(): void {}
}
