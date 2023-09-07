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

  constructor() {}

  ngOnInit(): void {}
}
