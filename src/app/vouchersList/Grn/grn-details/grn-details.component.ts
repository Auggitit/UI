import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { GrnService } from 'src/app/services/grn.service';

@Component({
  selector: 'app-grn-details',
  templateUrl: './grn-details.component.html',
  styleUrls: ['./grn-details.component.scss'],
})
export class GrnDetailsComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  grnForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  grnData: any;
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
    private grnApi: GrnService,
    private router: ActivatedRoute,
    private navigate: Router,
    private fb: FormBuilder
  ) {
    this.grnForm = this.fb.group({
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
    this.navigate.navigateByUrl('grn');
  }

  loadData() {
    let params = this.router.snapshot.queryParams['id'];
    this.grnApi.getGrnDetail({ id: params }).subscribe((res: any) => {
      console.log(res, 'responseeeeeeee---------------');
      this.loading = false;
      this.grnData = res;
      this.productsData = res.products;
      this.cGst = Number(res.cgstTotal);
      this.sGst = Number(res.sgstTotal);
      this.iGst = Number(res.igstTotal);
      this.Total = Number(res.net);

      let companyAddress = this.grnData.companyaddress;
      let deliveryAddress = this.grnData.companyaddress;

      this.addressLine1 = companyAddress;
      this.addressLine2 = companyAddress;
      this.deliveryAddressLine1 = deliveryAddress;
      this.deliveryAddressLine2 = deliveryAddress;
    });
  }

  downloadAsPDF() {
    console.log('clicked');
    var data = this.contentToSave.nativeElement;
    html2canvas(data).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'pt', 'a4');
      pdf.text(' Sales Order Details', 200, 50);
      pdf.addImage(contentDataURL, 'PNG', 50, 100, 510, 600);
      pdf.addPage();
      pdf.save('Sales Details Report.pdf');
    });
  }
}
