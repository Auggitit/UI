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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ConfirmationDialogBoxComponent } from 'src/app/shared/components/confirmation-dialog-box/confirmation-dialog-box.component';
@Component({
  selector: 'app-LedgerGroup-list',
  templateUrl: './LedgerGroup-list.component.html',
  styleUrls: ['./LedgerGroup-list.component.scss'],
})
export class LedgerGroupListComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  pageCount: number = 10;
  filteredData: any[] = [];
  paginationIndex: number = 0;
  selectAllCheckbox!: FormControlName;
  LedgerGroupForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  tableHeaderAlignValue: string = 'left';

  columns: any[] = [
    {
      title: 'GROUP_NAME',
      sortable: 0,
      name: 'groupname',
      needToShow: true,
    },
    { title: 'Action', sortable: 0, name: '', needToShow: true },
  ];
  selectAll = { isSelected: false };

  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.LedgerGroupForm = this.fb.group({
      selectAllCheckbox: [{ isSelected: false }],
      SelectSaveOptions: [exportOptions[0].id],
      searchValues: [''],
      columnFilter: [
        {
          title: 'GROUP_NAME',
          sortable: 0,
          name: 'groupname',
          needToShow: true,
        },
        { title: 'Action', sortable: 0, name: '', needToShow: true },
      ],
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.LedgerGroupForm.valueChanges.subscribe((values) => this.loadData(values));
  }

  onClickButton(): void {
    this.router.navigateByUrl('LedgerGroup-create');
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
      let ledgerGroupTemp = [];
      ledgerGroupTemp.push(
        serverData.filter((i: any) =>
          i.statename
            .toLowerCase()
            .includes(formValues.searchValues.toLowerCase())
        )
      );
      this.filteredData = ledgerGroupTemp;
    }
  }

  loadData(formValues?: any) {
    console.log('Called load Data');
    this.api.get_LedgerGroup().subscribe((res)=>{
      console.log(res,'...........response');
      this.getFilterData(formValues, res);      
    });
  }

  onClickEdit(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogBoxComponent, {
      data: {
        iconToDisplay: 'EditData',
        contentText: 'Do you Modify data?',
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.router.navigateByUrl('create-ledger/' + data.id);
        this.router.navigate(['LedgerGroup-create/' + data.id], {
          queryParams: { type: 'edit' },
        });
      }
    });
  }

  onClickDelete(rowdata: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogBoxComponent, {
      data: {
        iconToDisplay: 'DeleteFile',
        contentText: 'Do You Want To Delete Data ?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.api.DeleteMledger(rowdata.id).subscribe(
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

  downloadAsPDF() {
    console.log(
      'this.LedgerGroupForm.value.SelectSaveOptions',
      this.LedgerGroupForm.value.SelectSaveOptions
    );
    if (this.LedgerGroupForm.value.SelectSaveOptions === 0 || this.LedgerGroupForm.value.SelectSaveOptions === 'PDF') {
      let topValue = 0;
      var data = this.contentToSave.nativeElement;

      html2canvas(data, { scale: 2 }).then(() => {
        let pdf = new jsPDF('p', 'pt', 'a4');

        let tableData = this.filteredData
          .flatMap((item) => item)
          .map((item) => item);
        console.log(tableData, 'tabledata');
        pdf.setLineWidth(2);
        pdf.text('LedgerGroup Summary', 240, (topValue += 50));
        pdf.setFontSize(12);

        autoTable(pdf, {
          body: tableData,
          columns: [
            {
              header: 'GROUP_NAME',
              dataKey: 'groupname',
            }
          ],
          startY: (topValue += 30),
          theme: 'striped',
        });
        pdf.save('LedgerGroup.pdf');
      });
    } else {
      //Code for Excel Format Download
      /* var blob = new Blob([html],{type: 'data:application/vnd.ms-excel' });
      var u = URL.createObjectURL(blob);
      window.open(u); */

      let element = document.getElementById('LedgerGroupTable')!;

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      wb.Props = {
        Title: 'LedgerGroup List',
      };
      var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([['']]);
      var wsCols = [{ wch: 7 }, { wch: 15 }, { wch: 45 }, { wch: 45 }];
      ws['!cols'] = wsCols;
      XLSX.utils.sheet_add_aoa(ws, [['LedgerGroup Summary']], { origin: 'E1' });
      XLSX.utils.sheet_add_aoa(ws, [['So.No', 'GROUP_NAME']], { origin: 'A3' });
      XLSX.utils.sheet_add_dom(ws, element, { origin: 'A5' });
      XLSX.utils.book_append_sheet(wb, ws, 'LedgerGroup Summary');
      XLSX.writeFile(wb, 'LedgerGroup Report.xlsx');
    }
  }
}
