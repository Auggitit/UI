import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ConfirmationDialogBoxComponent } from 'src/app/shared/components/confirmation-dialog-box/confirmation-dialog-box.component';

@Component({
  selector: 'app-contra-voucher-list',
  templateUrl: './contra-voucher-list.component.html',
  styleUrls: ['./contra-voucher-list.component.scss'],
})
export class ContraVoucherListComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  contraVoucherForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  pageCount: number = 10;
  filteredData: any[] = [];
  paginationIndex: number = 0;
  vchType = 'Contra';
  tableHeaderAlignValue: string = 'left';

  columns: any[] = [
    {
      title: 'Vch No',
      sortable: 0,
      name: 'vch_no',
      needToShow: true,
    },
    {
      title: 'Account Name',
      sortable: 0,
      name: 'account_name',
      needToShow: true,
    },
    {
      title: 'Ledger Name',
      sortable: 0,
      name: 'ledger_name',
      needToShow: true,
    },
    {
      title: 'Voucher Date',
      sortable: 0,
      name: 'vch_date',
      needToShow: true,
    },
    {
      title: 'Amount',
      sortable: 0,
      name: 'amount',
      needToShow: true,
    },
    { title: 'Action', sortable: 0, name: '', needToShow: true },
  ];

  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.contraVoucherForm = this.fb.group({
      selectAllCheckbox: [{ isSelected: false }],
      SelectSaveOptions: [exportOptions[0].id],
      searchValues: [''],
      columnFilter: [
        {
          title: 'Vch No',
          sortable: 0,
          name: 'vch_no',
          needToShow: true,
        },
        {
          title: 'Account Name',
          sortable: 0,
          name: 'account_name',
          needToShow: true,
        },
        {
          title: 'Ledger Name',
          sortable: 0,
          name: 'ledger_name',
          needToShow: true,
        },
        {
          title: 'Voucher Date',
          sortable: 0,
          name: 'vch_date',
          needToShow: true,
        },
        {
          title: 'Amount',
          sortable: 0,
          name: 'amount',
          needToShow: true,
        },
        { title: 'Action', sortable: 0, name: '', needToShow: true },
      ],
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.contraVoucherForm.valueChanges.subscribe((values) => this.loadData(values));
  }

  loadData(formValues?: any) {
    this.api.fetch_voucher_list(1, 2, this.vchType).subscribe((res) => {
      let data = new MatTableDataSource(JSON.parse(res)).filteredData;
      this.getFilterData(formValues, data);
    });
  }

  onClickEdit(rowData: any) {}

  onClickDelete(rowData: any) {}

  getFilterData(formValues: any, serverData: any) {
    let newArr: any[] = [];
    let rowIndex = 0;
    let rowCount = 0;

    for (let data of serverData) {
      console.log("data one",data)
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
      let contraVoucherTemp = [];
      contraVoucherTemp.push(
        serverData.filter((i: any) =>
          i.statename
            .toLowerCase()
            .includes(formValues.searchValues.toLowerCase())
        )
      );
      this.filteredData = contraVoucherTemp;
    }
  }

  onClickButton(): void {
    this.router.navigateByUrl('contra-voucher-create');
  }

  downloadAsPDF() {
    if (
      this.contraVoucherForm.value.SelectSaveOptions === 0 ||
      this.contraVoucherForm.value.SelectSaveOptions == 'PDF'
    ) {
      let topValue = 0;
      var data = this.contentToSave.nativeElement;

      html2canvas(data, { scale: 2 }).then(() => {
        let pdf = new jsPDF('p', 'pt', 'a4');

        let tableData = this.filteredData
          .flatMap((item) => item)
          .map((item) => item);
        console.log(tableData, 'tabledata');
        pdf.setLineWidth(2);
        pdf.text('Contra Voucher', 240, (topValue += 50));
        pdf.setFontSize(12);

        autoTable(pdf, {
          body: tableData,
          columns: [
            {
              header: 'Vch No',
              dataKey: 'vch_no',
            },
            {
              header: 'Account Name',
              dataKey: 'account_name',
            },
            {
              header: 'Ledger Name',
              dataKey: 'ledger_name',
            },
            {
              header: 'Voucher Date',
              dataKey: 'vch_date',
            },
            {
              header: 'Amount',
              dataKey: 'amount',
            },
          ],
          startY: (topValue += 30),
          theme: 'striped',
        });
        pdf.save('ContraVoucher.pdf');
      });
    } else {
      //Code for Excel Format Download
      /* var blob = new Blob([html],{type: 'data:application/vnd.ms-excel' });
      var u = URL.createObjectURL(blob);
      window.open(u); */

      let element = document.getElementById('contraVoucherTable')!;

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      wb.Props = {
        Title: 'Contra Voucher List',
      };
      var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([['']]);
      var wsCols = [{ wch: 7 }, { wch: 15 }, { wch: 45 }, { wch: 45 }];
      ws['!cols'] = wsCols;
      XLSX.utils.sheet_add_aoa(ws, [['Cpntra Voucher Summary']], {
        origin: 'E1',
      });
      XLSX.utils.sheet_add_aoa(
        ws,
        [['Vch No','Account Name','Ledger Name','Voucher Date','Amount']],
        { origin: 'A3' }
      );
      XLSX.utils.sheet_add_dom(ws, element, { origin: 'A5' });
      XLSX.utils.book_append_sheet(wb, ws, 'Contra Voucher Summary');
      XLSX.writeFile(wb, 'Contra Voucher Report.xlsx');
    }
  }
}
