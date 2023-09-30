import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ApiService } from 'src/app/services/api.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogBoxComponent } from 'src/app/shared/components/confirmation-dialog-box/confirmation-dialog-box.component';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';

@Component({
  selector: 'app-ledger-list',
  templateUrl: './ledger-list.component.html',
  styleUrls: ['./ledger-list.component.scss'],
})
export class LedgerListComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  pageCount: number = 10;
  filteredData: any[] = [];
  paginationIndex: number = 0;
  selectAllCheckbox!: FormControlName;
  ledgerForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  searchledger: any;
  tableHeaderAlignValue: string = 'left';

  columns: any[] = [
    {
      title: 'Ledger Code',
      sortable: 0,
      name: 'ledgerCode',
      needToShow: true,
    },
    {
      title: 'Ledger Name',
      sortable: 0,
      name: 'companyDisplayName',
      needToShow: true,
    },
    {
      title: 'Ledger Under',
      sortable: 0,
      name: 'groupName',
      needToShow: true,
    },
    { title: 'Action', sortable: 0, name: '', needToShow: true },
  ];
  selectAll = { isSelected: false };

  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.ledgerForm = this.fb.group({
      selectAllCheckbox: [{ isSelected: false }],
      SelectSaveOptions: [exportOptions[0].id],
      searchValues: [''],
      columnFilter: [
        {
          title: 'Ledger Code',
          sortable: 0,
          name: 'ledgerCode',
          needToShow: true,
        },
        { title: 'Ledger Name', sortable: 0, name: 'sono', needToShow: true },
        {
          title: 'Ledger Under',
          sortable: 0,
          name: 'ordered',
          needToShow: true,
        },
        { title: 'Action', sortable: 0, name: '', needToShow: true },
      ],
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.ledgerForm.valueChanges.subscribe((values) => this.loadData(values));
  }

  onClickButton(): void {
    this.router.navigateByUrl('create-ledger');
  }

  onClickEdit(data: any) {
    var msg = '';
    if (data.pending == 0) {
      msg = 'SO is Completed! It is not possible to  Edit';
    } else {
      msg = 'Do you Modify data?';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogBoxComponent, {
      data: {
        iconToDisplay: 'EditData',
        contentText: msg,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.router.navigate(['create-ledger/' + data.id], {
          queryParams: { type: 'edit' },
        });
      }
    });
  }

  getFilterData(formValues: any, serverData: any) {
    let newArr: any[] = [];
    let rowIndex = 0;
    let rowCount = 0;

    for (let data of serverData) {
      if (rowCount === this.pageCount) {
        rowCount = 0;
        rowIndex++;
      }
      if (!newArr[rowIndex]) {
        newArr[rowIndex] = [];
      }
      newArr[rowIndex].push(data);
      rowCount++;
    }

    this.filteredData = newArr;
    console.log(this.filteredData, 'filrteeeeeeee');

    if (formValues?.searchValues.length > 0) {
      let vendorTemp = [];
      vendorTemp.push(
        serverData.filter((i: any) =>
          i.companyDisplayName
            .toLowerCase()
            .includes(formValues.searchValues.toLowerCase())
        )
      );
      this.filteredData = vendorTemp;
    }
  }

  onClickDelete(rowdata: any) {
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: 'Do you confirm the deletion of this ledger data?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.api.delete_Ledger(rowdata.id).subscribe(
          (data) => {
            let dialogRef = this.dialog.open(SuccessmsgComponent, {
              //width: '350px',
              data: 'Successfully Deleted!',
            });
            dialogRef.afterClosed().subscribe((result) => {
              this.loadData();
            });
          },
          (err) => {
            console.log(err);
            alert('Some Error Occured');
          }
        );
      }
    });
  }

  loadData(formValues?: any) {
    this.api.getOtherLedgers().subscribe((res) => {
      console.log(res, '...........response');
      this.getFilterData(formValues, res);
    });
  }

  downloadAsPDF() {
    if (this.ledgerForm.value.SelectSaveOptions === 0) {
      let topValue = 0;
      var data = this.contentToSave.nativeElement;

      html2canvas(data, { scale: 2 }).then(() => {
        let pdf = new jsPDF('p', 'pt', 'a4');

        let tableData = this.filteredData
          .flatMap((item) => item)
          .map((item) => item);
        console.log(tableData, 'tabledata');
        pdf.setLineWidth(2);
        pdf.text('Ledger', 240, (topValue += 50));
        pdf.setFontSize(12);

        autoTable(pdf, {
          body: tableData,
          columns: [
            {
              header: 'Ledger Code',
              dataKey: 'ledgerCode',
            },
            {
              header: 'Ledger Name',
              dataKey: 'companyDisplayName',
            },
            {
              header: 'Ledger Under',
              dataKey: 'groupName',
            },
          ],
          startY: (topValue += 30),
          theme: 'striped',
        });
        pdf.save('Ledger.pdf');
      });
    } else {
      //Code for Excel Format Download
      /* var blob = new Blob([html],{type: 'data:application/vnd.ms-excel' });
      var u = URL.createObjectURL(blob);
      window.open(u); */

      let element = document.getElementById('ledgerTable')!;

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      wb.Props = {
        Title: 'Ledger List',
      };
      var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([['']]);
      var wsCols = [{ wch: 7 }, { wch: 15 }, { wch: 45 }, { wch: 45 }];
      ws['!cols'] = wsCols;
      XLSX.utils.sheet_add_aoa(ws, [['Ledger Summary']], { origin: 'E1' });
      XLSX.utils.sheet_add_aoa(
        ws,
        [['So.No', 'Ledger Code', 'Ledger Name', 'Ledger Under']],
        { origin: 'A3' }
      );
      XLSX.utils.sheet_add_dom(ws, element, { origin: 'A5' });
      XLSX.utils.book_append_sheet(wb, ws, 'Ledger Summary');
      XLSX.writeFile(wb, 'Ledger Report.xlsx');
    }
  }
}
