import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-mat-area-graph',
  template: ` <div class="card">
    <div class="card-body" style="position:relative;">
      <div class="d-flex  flex-wrap justify-content-between">
        <div>
          <p style="color: #333843; font-size: 1.125rem; font-weight: 600">
            {{ title }}
          </p>
          <p style="color: #667085">{{ subTitle }}</p>
        </div>
        <i
          class="bi bi-three-dots-vertical"
          [matMenuTriggerFor]="threeDotOptions"
        ></i>
        <mat-menu #threeDotOptions="matMenu">
          <button
            *ngFor="let data of menuItems; let i = index"
            mat-menu-item
            (click)="onClickMenu(data)"
          >
            {{ data }}
          </button>
        </mat-menu>
      </div>
      <apx-chart
        [series]="chartOptions['series']"
        [chart]="chartOptions['chart']"
        [xaxis]="chartOptions['xaxis']"
        [stroke]="chartOptions['stroke']"
        [dataLabels]="chartOptions['dataLabels']"
        [fill]="chartOptions['fill']"
      ></apx-chart>
    </div>
  </div>`,
})
export class MatAreaGraphComponent implements OnInit {
  @Input('chart-options') public chartOptions: any = {};
  @Input('title') title: string = '';
  @Input('subTitle') subTitle: string = '';
  @Input() menuItems!: any;
  @Output() onClickGraphMenu = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onClickMenu(event: any): void {
    console.log(event, 'event');
    this.onClickGraphMenu.emit(event);
  }
}
