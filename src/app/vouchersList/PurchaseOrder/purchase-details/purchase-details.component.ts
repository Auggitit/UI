import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PoService } from 'src/app/services/po.service';

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.scss'],
})
export class PurchaseDetailsComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  purchaseOrderDetailsForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  purchaseOrderData: any;
  productsData: any[] = [];
  addressLine1: string = '';
  addressLine2: string = '';
  deliveryAddressLine1: string = '';
  deliveryAddressLine2: string = '';
  loading: boolean = true;

  constructor(
    private poApi: PoService,
    private router: ActivatedRoute,
    private navigate: Router,
    private fb: FormBuilder
  ) {
    this.purchaseOrderDetailsForm = this.fb.group({
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
    this.navigate.navigateByUrl('po');
  }

  loadData() {
    let params = this.router.snapshot.queryParams['id'];
    console.log(params, 'params');
    this.poApi.getPoDetail({ id: params }).subscribe((res: any) => {
      console.log(res, '..........res');
      this.loading = false;
      this.purchaseOrderData = res;
      this.productsData = res.products;

      let companyAddress = this.purchaseOrderData.companyaddress
        .replace(/[\n]/g, '')
        .replace(/, +|,+/g, ',')
        .split(',');
      let deliveryAddress = this.purchaseOrderData.deliveryaddress
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
      pdf.text(' Purchase Details', 200, 50);
      pdf.addImage(contentDataURL, 'PNG', 50, 100, 510, 880);
      pdf.addPage();
      pdf.save('Purchase Details Report.pdf');
    });
  }
}
