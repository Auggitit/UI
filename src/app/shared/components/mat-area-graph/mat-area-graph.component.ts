import { Component, Input, OnInit } from '@angular/core';

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
        <!-- <div class="d-flex  flex-wrap" style="gap:8px">
          <div class="d-flex">
            <i class="bi bi-circle-fill fa-sm" style="color:#419FC7"></i>
            <p class="pl-1 fa-sm">This year</p>
          </div>
          <div class="d-flex">
            <i class="bi bi-circle-fill fa-sm" style="color:#E46A11"></i>
            <p class="pl-1 fa-sm">Last year</p>
          </div>
        </div> -->
        <i
          class="bi bi-three-dots-vertical"
          [matMenuTriggerFor]="threeDotOptions"
        ></i>

        <mat-menu #threeDotOptions="matMenu" style="width: 200%">
          <button
            mat-menu-item
            style="
                    border-bottom: 0.5px solid #959ba433;
                    margin: 0px 10%;
                    width: 80%;
                  "
          >
            Year
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
  constructor() {}

  ngOnInit(): void {}
}
