import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { SoService } from 'src/app/services/so.service';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-sales-order-details',
  templateUrl: './sales-order-details.component.html',
  styleUrls: ['./sales-order-details.component.scss'],
})
export class SalesOrderDetailsComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  salesOrderDetailsForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  salesOrderData: any;
  addressLine1: string = '';
  addressLine2: string = '';
  deliveryAddressLine1: string = '';
  deliveryAddressLine2: string = '';
  productsData: any[] = [];
  loading: boolean = true;
  cGst: number = 0;
  sGst: number = 0;
  iGst: number = 0;
  Total: number = 0;

  constructor(
    private salesOrderApi: SoService,
    private router: ActivatedRoute,
    private navigate: Router,
    private fb: FormBuilder
  ) {
    this.salesOrderDetailsForm = this.fb.group({
      SelectSaveOptions: [exportOptions[0].id],
    });
  }

  ngOnInit(): void {
    this.loadData();
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
    let params = this.router.snapshot.queryParams['id'];
    this.salesOrderApi.getSoDetail({ id: params }).subscribe((res: any) => {
      console.log(res, '-----response');
      this.loading = false;
      this.salesOrderData = res;
      this.productsData = res.products;
      this.cGst = Number(res.cgstTotal);
      this.sGst = Number(res.sgstTotal);
      this.iGst = Number(res.igstTotal);
      this.Total = Number(res.net);

      let companyAddress = this.salesOrderData.companyaddress
        .replace(/[\n]/g, '')
        .replace(/, +|,+/g, ',')
        .split(',');
      let deliveryAddress = this.salesOrderData.deliveryaddress
        .replace(/[\n]/g, '')
        .replace(/, +|,+/g, ',')
        .split(',');

      this.addressLine1 = companyAddress.slice(0, 2).join(', ');
      this.addressLine2 = companyAddress.slice(2).join(', ');
      this.deliveryAddressLine1 = deliveryAddress.slice(0, 2).join(', ');
      this.deliveryAddressLine2 = deliveryAddress.slice(2).join(', ');
    });
  }

  downloadAsPDF() {
    console.log('clicked');
    var data = this.contentToSave.nativeElement;
    html2canvas(data, { scale: 2 }).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'pt', 'a4');
      pdf.text(' Sales Order Details', 200, 50);
      pdf.addImage(contentDataURL, 'PNG', 50, 100, 510, 880);
      pdf.addPage();
      pdf.save('Sales Details Report.pdf');
    });
  }
}
