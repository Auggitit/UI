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

      this.grnData = res;
      this.productsData = res.soDetailLists;

      let companyAddress = this.grnData.companyaddress
        .replace(/[\n]/g, '')
        .replace(/, +|,+/g, ',')
        .split(',');
      let deliveryAddress = this.grnData.deliveryaddress
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
      pdf.text(' GRN Details', 200, 50);
      pdf.addImage(contentDataURL, 'PNG', 50, 100, 510, 880);
      pdf.addPage();
      pdf.save('GRN Report.pdf');
    });
  }
}
