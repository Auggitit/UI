import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ConfirmationDialogBoxComponent } from 'src/app/shared/components/confirmation-dialog-box/confirmation-dialog-box.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cash-payment-list',
  templateUrl: './cash-payment-list.component.html',
  styleUrls: ['./cash-payment-list.component.scss'],
})
export class CashPaymentListComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  vchno: any;
  vchType: any = 'Cash Payment';
  branch: any;
  fy: any;
  pageCount: number = 10;
  filteredData: any[] = [];
  paginationIndex: number = 0;
  selectAllCheckbox!: FormControlName;
  CashPaymentForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  searchCustomer: any;
  tableHeaderAlignValue: string = 'left';
  loading: boolean = true;

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
      title: 'VCH Date',
      sortable: 0,
      name: 'vch_date',
      needToShow: true,
    },
    {
      title: 'Payment Mode',
      sortable: 0,
      name: 'payment_mode',
      needToShow: true,
    },
    {
      title: 'Amount',
      sortable: 0,
      name: 'amount',
      needToShow: true,
    },
    {
      title: 'CHQ NO',
      sortable: 0,
      name: 'chq_no',
      needToShow: true,
    },
    {
      title: 'CHQ Date',
      sortable: 0,
      name: 'chq_date',
      needToShow: true,
    },
    {
      title: 'Online Ref No',
      sortable: 0,
      name: 'online_ref',
      needToShow: true,
    },
    {
      title: 'Online Ref Date',
      sortable: 0,
      name: 'online_ref_date',
      needToShow: true,
    },
    { title: 'Action', sortable: 0, name: '', needToShow: true },
  ];
  selectAll = { isSelected: false };

  constructor(
    public router: Router,
    public api: ApiService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public receiptapi: ApiService
  ) {
    this.CashPaymentForm = this.fb.group({
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
          title: 'VCH Date',
          sortable: 0,
          name: 'vch_date',
          needToShow: true,
        },
        {
          title: 'Payment Mode',
          sortable: 0,
          name: 'payment_mode',
          needToShow: true,
        },
        {
          title: 'Amount',
          sortable: 0,
          name: 'amount',
          needToShow: true,
        },
        {
          title: 'CHQ NO',
          sortable: 0,
          name: 'chq_no',
          needToShow: true,
        },
        {
          title: 'CHQ Date',
          sortable: 0,
          name: 'chq_date',
          needToShow: true,
        },
        {
          title: 'Online Ref No',
          sortable: 0,
          name: 'online_ref',
          needToShow: true,
        },
        {
          title: 'Online Ref Date',
          sortable: 0,
          name: 'online_ref_date',
          needToShow: true,
        },
        { title: 'Action', sortable: 0, name: '', needToShow: true },
      ],
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.CashPaymentForm.valueChanges.subscribe((values) =>
      this.loadData(values)
    );
  }

  onClickButton(): void {
    this.router.navigateByUrl('cash-payment-create');
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
      if (data.chq_no == null) {
        data.chq_no = '-';
      }
      if (data.chq_date == null) {
        data.chq_date = '-';
      }
      if (data.online_ref == null) {
        data.online_ref = '-';
      }
      if (data.online_ref_date == null) {
        data.online_ref_date = '-';
      }
      newArr[rowIndex].push(data);
      rowCount++;
    }
    this.filteredData = newArr;
    if (formValues.searchValues.length > 0) {
      let CashPaymentTemp = [];
      CashPaymentTemp.push(
        serverData.filter((i: any) =>
          i.account_name
            ?.toLowerCase()
            .includes(formValues.searchValues.toLowerCase())
        )
      );
      this.filteredData = CashPaymentTemp;
    }
  }

  loadData(formValues?: any) {
    this.api.GetVoucherList(1, 2, this.vchType).subscribe((res) => {
      let data = new MatTableDataSource(JSON.parse(res)).filteredData;
      this.getFilterData(formValues, data);
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
        this.router.navigate(['cash-payment-create/' + data.Id], {
          queryParams: { type: 'edit' },
        });
      }
    });
  }

  onClickDelete(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogBoxComponent, {
      data: {
        iconToDisplay: 'DeleteFile',
        contentText: 'Do You Want To Delete Data ?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.vchno = data.vch_no;
        this.vchType = data.vch_type;
        this.branch = '001';
        this.fy = '001';
        this.deletesales();
        // this.api
        //   .Delete_voucher(data.vch_no,data.vch_type,'001','001')
        //   .subscribe((res) => {
        //     Swal.fire({
        //       icon: 'success',
        //       title: 'Deleted!',
        //       text: 'Bank Receipt Deleted Successfully',
        //     });
        //     this.loading = false;
        //     this.loadData(data);
        //   });
      }
      //   if(result){
      //     this.api
      //       .Delete_overdue(data.vch_no,data.vch_type,'001','001')
      //       .subscribe((res) => {
      //         Swal.fire({
      //           icon: 'success',
      //           title: 'Deleted!',
      //           text: 'Bank Receipt Deleted Successfully',
      //         });
      //         this.loading = false;
      //         this.loadData(data);
      //       });
      //   }
      //   if(result){
      //     this.api
      //       .Delete_ledger(data.vch_no,data.vch_type,'001','001')
      //       .subscribe((res) => {
      //         Swal.fire({
      //           icon: 'success',
      //           title: 'Deleted!',
      //           text: 'Bank Receipt Deleted Successfully',
      //         });
      //         this.loading = false;
      //         this.loadData(data);
      //       });
      //   }
    });
  }
  deletesales() {
    // this.vchno = r.vch_no;
    // this.vchType = r.vch_type;
    if (this.vchno && this.vchType) {
      this.deleteExistingEntries().then((res) => {
        this.loadData();
      });
    }
  }

  deleteExistingEntries() {
    return new Promise((resolve) => {
      this.deleteVoucher().then((res) => {
        this.deleteledger().then((res) => {
          this.deleteOverdue().then((res) => {
            resolve({ action: 'success' });
          });
        });
      });
    });
  }

  deleteVoucher() {
    return new Promise((resolve) => {
      this.receiptapi
        .Delete_voucher(this.vchno, this.vchType, this.branch, this.fy)
        .subscribe((res) => {
          resolve({ action: 'success' });
        });
    });
  }

  deleteledger() {
    return new Promise((resolve) => {
      this.receiptapi
        .Delete_ledger(this.vchno, this.vchType, this.branch, this.fy)
        .subscribe((res) => {
          resolve({ action: 'success' });
        });
    });
  }
  deleteOverdue() {
    return new Promise((resolve) => {
      this.receiptapi
        .Delete_overdue(this.vchno, this.vchType, this.branch, this.fy)
        .subscribe((res) => {
          resolve({ action: 'success' });
        });
    });
  }
  // }
  downloadAsPDF() {
    console.log(
      'this.CashPaymentForm.value.SelectSaveOptions',
      this.CashPaymentForm.value.SelectSaveOptions
    );
    if (
      this.CashPaymentForm.value.SelectSaveOptions === 0 ||
      this.CashPaymentForm.value.SelectSaveOptions === 'PDF'
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
        pdf.text('CashPayment Summary', 240, (topValue += 50));
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
              header: 'VCH Date',
              dataKey: 'vch_date',
            },
            {
              header: 'Payment Mode',
              dataKey: 'payment_mode',
            },
            {
              header: 'Amount',
              dataKey: 'amount',
            },
            {
              header: 'CHQ NO',
              dataKey: 'chq_no',
            },
            {
              header: 'CHQ Date',
              dataKey: 'chq_date',
            },
            {
              header: 'Online Ref No',
              dataKey: 'online_ref',
            },
            {
              header: 'Online Ref Date',
              dataKey: 'online_ref_date',
            },
          ],

          startY: (topValue += 30),
          theme: 'striped',
        });
        pdf.save('Cash Payment.pdf');
      });
    } else {
      //Code for Excel Format Download
      /* var blob = new Blob([html],{type: 'data:application/vnd.ms-excel' });
      var u = URL.createObjectURL(blob);
      window.open(u); */

      let element = document.getElementById('cashPaymentTable')!;

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      wb.Props = {
        Title: 'Cash Payment List',
      };
      var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([['']]);
      var wsCols = [{ wch: 7 }, { wch: 15 }, { wch: 45 }, { wch: 45 }];
      ws['!cols'] = wsCols;
      XLSX.utils.sheet_add_aoa(ws, [['Cash Payment Summary']], { origin: 'E1' });
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            'Vch No',
            'Account Name',
            'Ledger Name',
            'VCH Date',
            'Payment Mode',
            'Amount',
            'CHQ No',
            'CHQ Date',
            'Online Ref No',
            'Online Ref Date',
          ],
        ],
        { origin: 'A3' }
      );
      XLSX.utils.sheet_add_dom(ws, element, { origin: 'A5' });
      XLSX.utils.book_append_sheet(wb, ws, 'Cash Payment Summary');
      XLSX.writeFile(wb, 'CashPayment Report.xlsx');
    }
  }
}
