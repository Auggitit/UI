import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mat-header',
  template: `<div>
    <div class="header" style="font-weight:600; font-size:20px;">
      {{ title }}
    </div>
  </div>`,
})
export class MatHeaderComponent implements OnInit {
  @Input() title: string = '';
  constructor() {}

  ngOnInit(): void {}
}
