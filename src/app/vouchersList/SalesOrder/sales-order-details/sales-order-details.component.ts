import { Component, OnInit } from '@angular/core';
import {
  dateFilterOptions,
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { SalesService } from 'src/app/services/sales.service';

@Component({
  selector: 'app-sales-order-details',
  templateUrl: './sales-order-details.component.html',
  styleUrls: ['./sales-order-details.component.scss'],
})
export class SalesOrderDetailsComponent implements OnInit {
  filterByOptions: dropDownData[] = dateFilterOptions;
  saveAsOptions: dropDownData[] = exportOptions;
  salesOrderData: any[] = [];
  productsData: any[] = [];

  constructor(private salesapi: SalesService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.salesapi.getPendingSOListAll().subscribe((res: any[]) => {
      if (res.length) {
        this.salesOrderData = res;
        this.productsData = res[0].solistDetails;

        console.log(this.salesOrderData, 'sales order data');
      }
    });
  }
}
