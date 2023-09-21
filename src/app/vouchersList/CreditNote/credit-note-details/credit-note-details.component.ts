import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CrnoteService } from 'src/app/services/credit.service';

@Component({
  selector: 'app-credit-note-details',
  templateUrl: './credit-note-details.component.html',
  styleUrls: ['./credit-note-details.component.scss'],
})
export class CreditNoteDetailsComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  creditNoteDetailsForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  creditNoteData: any;
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
    private creditApi: CrnoteService,
    private router: ActivatedRoute,
    private navigate: Router,
    private fb: FormBuilder
  ) {
    this.creditNoteDetailsForm = this.fb.group({
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
    // this.navigate.navigateByUrl('so');
    console.log('clicked');
  }

  loadData() {
    let params = this.router.snapshot.queryParams['id'];
    this.creditApi.getCreditDetail({ id: params }).subscribe((res: any) => {
      console.log(res, '--------------res');
      this.loading = false;

      this.creditNoteData = res;
      this.productsData = res.products;
      this.cGst = Number(res.cgstTotal);
      this.sGst = Number(res.sgstTotal);
      this.iGst = Number(res.igstTotal);
      this.Total = Number(res.net);
      let companyAddress = this.creditNoteData.companyaddress;
      // this.creditNoteData.companyaddress !== ''
      // ? this.creditNoteData.companyaddress
      //     .replace(/[\n]/g, '')
      //     .replace(/, +|,+/g, ',')
      //     .split(',')
      // : '';
      let deliveryAddress = this.creditNoteData.companyaddress;
      // this.creditNoteData.deliveryaddress !== ''
      //   ? this.creditNoteData.deliveryaddress
      //       .replace(/[\n]/g, '')
      //       .replace(/, +|,+/g, ',')
      //       .split(',')
      //   : ' ';

      this.addressLine1 = companyAddress;
      this.addressLine2 = companyAddress;
      this.deliveryAddressLine1 = deliveryAddress;
      this.deliveryAddressLine2 = deliveryAddress;
      console.log(deliveryAddress, companyAddress, 'addredddddddddddddd');
    });
  }

  downloadAsPDF() {
    console.log('clicked');
    var data = this.contentToSave.nativeElement;
    html2canvas(data).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'pt', 'a4');
      pdf.text('Credit Note Details', 200, 50);
      pdf.addImage(contentDataURL, 'PNG', 50, 100, 510, 600);
      pdf.addPage();
      pdf.save('CN Report.pdf');
    });
  }
}
