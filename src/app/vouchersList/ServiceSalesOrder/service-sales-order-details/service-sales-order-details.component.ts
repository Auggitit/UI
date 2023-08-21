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

  constructor(
    private salesOrderApi: SoService,
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
    console.log(this.router.snapshot.queryParams['sono'], 'router.........');
  }

  gotoReportsPage(): void {
    console.log('gotoReportsPage');
  }

  onClickButton(): void {
    this.navigate.navigateByUrl('soservice');
  }

  loadData() {
    let params = this.router.snapshot.queryParams['sono'];
    this.salesOrderApi.getSoDetail({ sono: params }).subscribe((res: any) => {
      this.ServiceSOData = res;
      this.productsData = res.soDetailLists;
    });
  }

  downloadAsPDF() {
    var data = this.contentToSave.nativeElement;
    html2canvas(data, { scale: 2 }).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'pt', 'a4');
      pdf.text('Service SO Details', 200, 50);
      pdf.addImage(contentDataURL, 'PNG', 50, 100, 510, 880);
      pdf.addPage();
      pdf.save('Service SO Details Report.pdf');
    });
  }
}
