import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PoserviceService } from 'src/app/services/poservice.service';

@Component({
  selector: 'app-service-po-details',
  templateUrl: './service-po-details.component.html',
  styleUrls: ['./service-po-details.component.scss'],
})
export class ServicePoDetailsComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  purchaseOrderDetailsForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  purchaseOrderData: any;
  productsData: any[] = [];

  constructor(
    private servicePoApi: PoserviceService,
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
    let params = this.router.snapshot.queryParams['pono'];
    this.servicePoApi
      .getServicePoDetail({ pono: params })
      .subscribe((res: any) => {
        this.purchaseOrderData = res;
        this.productsData = res.soDetailLists;
      });
  }

  downloadAsPDF() {
    console.log('clicked');
    var data = this.contentToSave.nativeElement;
    html2canvas(data, { scale: 2 }).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'pt', 'a4');
      pdf.text(' Service Po Details', 200, 50);
      pdf.addImage(contentDataURL, 'PNG', 50, 100, 510, 880);
      pdf.addPage();
      pdf.save('Service Po Details Report.pdf');
    });
  }
}
