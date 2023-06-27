import { Component, OnInit, Input } from '@angular/core';
import {
  ApexChart,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
};
@Component({
  selector: 'app-target-and-achievement',
  templateUrl: './target-and-achievement.component.html',
  styleUrls: ['./target-and-achievement.component.scss'],
})
export class TargetAndAchievementComponent implements OnInit {
  @Input() title: string = '';
  @Input() subTitle: string = '';
  values: any[] = [
    { title: 'Target', value: '₹20k', color: '#F36960' },
    { title: 'Revenue', value: '₹16k', color: '#3DA172' },
    {
      title: 'This Year',
      value: '₹1.5k',
      color: '#3DA172',
    },
  ];
  chartSpec: any = {
    fontFamily: 'Inter',
    height: 310,
    type: 'radialBar',
    offsetY: -20,
    toolbar: {
      show: false,
    },
  };
  public chartOptions = {
    series: [76],
    chart: this.chartSpec,
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e7e7e7',
          strokeWidth: '40%',
          margin: 20, // margin is in pixels

          dropShadow: {
            enabled: true,
            left: 0,
            opacity: 0.31,
            blur: 2,
          },
        },
        dataLabels: {
          name: {
            show: true,
            color: '#0D894F',
            fontSize: '12px',
          },

          value: {
            offsetY: -40,
            fontSize: '24px',
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      colors: ['#419FC7'],
      gradient: {
        shade: 'light',
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91],
      },
    },
    labels: ['+10%'],
  };

  constructor() {}

  ngOnInit(): void {}
}
