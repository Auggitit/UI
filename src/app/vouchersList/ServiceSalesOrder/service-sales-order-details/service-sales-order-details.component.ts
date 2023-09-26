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
import { SsoService } from 'src/app/services/sso.service';

@Component({
  selector: 'app-service-sales-order-details',
  templateUrl: './service-sales-order-details.component.html',
  styleUrls: ['./service-sales-order-details.component.scss'],
})
export class ServiceSalesOrderDetailsComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  serviceSoDetailsForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  ServiceSOData: any;
  productsData: any[] = [];
  addressLine1: string = '';
  addressLine2: string = '';
  deliveryAddressLine1: string = '';
  deliveryAddressLine2: string = '';
  loading: boolean = true;
  cGst: number = 0;
  sGst: number = 0;
  iGst: number = 0;
  discount: number = 0;
  Total: number = 0;

  constructor(
    private salesOrderApi: SsoService,
    private router: ActivatedRoute,
    private navigate: Router,
    private fb: FormBuilder
  ) {
    this.serviceSoDetailsForm = this.fb.group({
      SelectSaveOptions: [exportOptions[0].id],
    });
  }

  ngOnInit(): void {
    this.loadData();
    console.log(this.router.snapshot.queryParams['id'], 'router.........');
  }

  gotoReportsPage(): void {
    console.log('gotoReportsPage');
  }

  onClickButton(): void {
    this.navigate.navigateByUrl('soservice');
  }

  loadData() {
    let params = this.router.snapshot.queryParams['id'];
    this.salesOrderApi
      .getServiceSoDetail({ id: params })
      .subscribe((res: any) => {
        console.log(res, '--------------response');
        this.loading = false;
        this.ServiceSOData = res;
        this.productsData = res.products;
        this.cGst = Number(res.cgstTotal);
        this.sGst = Number(res.sgstTotal);
        this.iGst = Number(res.igstTotal);
        let discount = 0;
        res.products.forEach((element: { discount: string; }) => {
          discount = Number(element.discount) + discount
        });
        this.discount = Number(discount);
        this.Total = Number(res.net);

        let companyAddress = this.ServiceSOData.companyaddress
          .replace(/[\n]/g, '')
          .replace(/, +|,+/g, ',')
          .split(',');
        let deliveryAddress = this.ServiceSOData.deliveryaddress
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
    html2canvas(data).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'pt', 'a4');
      pdf.text(' Service SO Details Details', 200, 50);
      pdf.addImage(contentDataURL, 'PNG', 50, 100, 510, 600);
      pdf.addPage();
      pdf.save('Service SO Details Report.pdf');
    });
  }
}
