import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  dateFilterOptions,
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { SalesService } from 'src/app/services/sales.service';
import { SoService } from 'src/app/services/so.service';

@Component({
  selector: 'app-sales-order-details',
  templateUrl: './sales-order-details.component.html',
  styleUrls: ['./sales-order-details.component.scss'],
})
export class SalesOrderDetailsComponent implements OnInit {
  salesOrderDetailsForm!: FormGroup;
  filterByOptions: dropDownData[] = dateFilterOptions;
  saveAsOptions: dropDownData[] = exportOptions;
  salesOrderData: any;
  productsData: any[] = [];

  constructor(
    private salesOrderApi: SoService,
    private router: ActivatedRoute,
    private navigate: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    console.log(this.router.snapshot.queryParams['sono'], 'router.........');
  }

  clickDownload(e: any): void {
    console.log(e, 'clickDownload');
  }

  gotoReportsPage(): void {
    console.log('gotoReportsPage');
  }

  onClickButton(): void {
    this.navigate.navigateByUrl('so');
  }

  loadData() {
    let params = this.router.snapshot.queryParams['sono'];
    console.log(params, 'params');

    this.salesOrderApi.getSoDetail({ sono: params }).subscribe((res: any) => {
      console.log(res, '...........reponae');

      this.salesOrderData = res;
      this.productsData = res.soDetailLists;
    });
  }
}
