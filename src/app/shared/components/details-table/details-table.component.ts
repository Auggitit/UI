import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-details-table',
  templateUrl: './details-table.component.html',
  styleUrls: ['./details-table.component.scss'],
})
export class DetailsTableComponent implements OnInit {
  columns: any[] = [
    { title: 'Sr No' },
    { title: 'Products' },
    { title: 'SKU' },
    { title: 'HSN' },
    { title: 'Price' },
    { title: 'Order Qty' },
    { title: 'Total' },
  ];
  @Input() productsData: any[] = [];
  @Input() cGstValue: number = 0;
  @Input() sGstValue: number = 0;
  @Input() iGstValue: number = 0;
  @Input() totalValue: number = 0;

  constructor() {}

  ngOnInit(): void {}
}
