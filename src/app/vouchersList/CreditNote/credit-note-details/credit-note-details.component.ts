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

      this.creditNoteData = res;
      this.productsData = res.products;
      let companyAddress =
        this.creditNoteData.companyaddress !== ''
          ? this.creditNoteData.companyaddress
              .replace(/[\n]/g, '')
              .replace(/, +|,+/g, ',')
              .split(',')
          : '';
      let deliveryAddress =
        this.creditNoteData.deliveryaddress !== ''
          ? this.creditNoteData.deliveryaddress
              .replace(/[\n]/g, '')
              .replace(/, +|,+/g, ',')
              .split(',')
          : ' ';

      this.addressLine1 = companyAddress.slice(0, 2).join(', ');
      this.addressLine2 = companyAddress.slice(2).join(', ');
      this.deliveryAddressLine1 = deliveryAddress.slice(0, 2).join(', ');
      this.deliveryAddressLine2 = deliveryAddress.slice(2).join(', ');
      console.log(deliveryAddress, companyAddress, 'addredddddddddddddd');
    });
  }

  downloadAsPDF() {
    console.log('clicked');
    var data = this.contentToSave.nativeElement;
    html2canvas(data, { scale: 2 }).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'pt', 'a4');
      pdf.text(' Credit Note Details', 200, 50);
      pdf.addImage(contentDataURL, 'PNG', 50, 100, 510, 880);
      pdf.addPage();
      pdf.save('Credit Details Report.pdf');
    });
  }
}
