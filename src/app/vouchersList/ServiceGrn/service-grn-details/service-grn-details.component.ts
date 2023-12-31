import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  dateFilterOptions,
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { GrnserviceService } from 'src/app/services/grnservice.service';
@Component({
  selector: 'app-service-grn-details',
  templateUrl: './service-grn-details.component.html',
  styleUrls: ['./service-grn-details.component.scss'],
})
export class ServiceGrnDetailsComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  serviceGrnDetailsForm!: FormGroup;
  filterByOptions: dropDownData[] = dateFilterOptions;
  saveAsOptions: dropDownData[] = exportOptions;
  serviceGnData: any;
  productsData: any[] = [];
  addressLine1: string = '';
  addressLine2: string = '';
  deliveryAddressLine1: string = '';
  deliveryAddressLine2: string = '';
  loading: boolean = true;
  cGst: number = 0;
  sGst: number = 0;
  iGst: number = 0;
  Total: number = 0;

  constructor(
    private serviceGrnApi: GrnserviceService,
    private router: ActivatedRoute,
    private navigate: Router,
    private fb: FormBuilder
  ) {
    this.serviceGrnDetailsForm = this.fb.group({
      SelectSaveOptions: [exportOptions[0].id],
    });
  }

  ngOnInit(): void {
    this.loadData();
    console.log(this.router.snapshot.queryParams['id'], 'router.........');
  }

  clickDownload(e: any): void {
    console.log(e, 'clickDownload');
  }

  gotoReportsPage(): void {
    console.log('gotoReportsPage');
  }

  onClickButton(): void {
    this.navigate.navigateByUrl('servicegrn');
  }

  loadData() {
    let params = this.router.snapshot.queryParams['id'];
    console.log(params, 'params');

    this.serviceGrnApi
      .getServiceGrnDetail({ id: params })
      .subscribe((res: any) => {
        console.log(res, '...........reponae');
        this.loading = false;
        this.serviceGnData = res;
        this.productsData = res.products;
        this.cGst = Number(res.cgstTotal);
        this.sGst = Number(res.sgstTotal);
        this.iGst = Number(res.igstTotal);
        this.Total = Number(res.net);

        let companyAddress = this.serviceGnData.companyaddress
          .replace(/[\n]/g, '')
          .replace(/, +|,+/g, ',')
          .split(',');
        let deliveryAddress = this.serviceGnData.deliveryaddress
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
    var data = this.contentToSave.nativeElement;
    html2canvas(data, { scale: 2 }).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'pt', 'a4');
      pdf.text('Service GRN Details', 200, 50);
      pdf.addImage(contentDataURL, 'PNG', 50, 100, 510, 880);
      pdf.addPage();
      pdf.save('Service GRN Details Report.pdf');
    });
  }
}
