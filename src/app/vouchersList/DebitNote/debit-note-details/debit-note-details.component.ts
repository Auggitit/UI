import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DrnoteService } from 'src/app/services/debit.service';

@Component({
  selector: 'app-debit-note-details',
  templateUrl: './debit-note-details.component.html',
  styleUrls: ['./debit-note-details.component.scss'],
})
export class DebitNoteDetailsComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  debitNoteDetailsForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  debitNoteData: any;
  productsData: any[] = [];

  constructor(
    private debitApi: DrnoteService,
    private router: ActivatedRoute,
    private navigate: Router,
    private fb: FormBuilder
  ) {
    this.debitNoteDetailsForm = this.fb.group({
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
    this.debitApi.getDebitDetail({ id: params }).subscribe((res: any) => {
      this.debitNoteData = res;
      this.productsData = res.soDetailLists;
    });
  }

  downloadAsPDF() {
    console.log('clicked');
    var data = this.contentToSave.nativeElement;
    html2canvas(data, { scale: 2 }).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'pt', 'a4');
      pdf.text(' Debit Note Details', 200, 50);
      pdf.addImage(contentDataURL, 'PNG', 50, 100, 510, 880);
      pdf.addPage();
      pdf.save('Debit Details Report.pdf');
    });
  }
}
