import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { VoucherService } from 'src/app/services/voucher.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControlName, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-listing-table-dialog',
  templateUrl: './listing-table-dialog.component.html',
  styleUrls: ['./listing-table-dialog.component.scss'],
})
export class ListingTableDialogComponent implements OnInit {
  @Input() iconForDialog!: string;
  @Input() contentText!: string;
  dataSource!: MatTableDataSource<any>;
  datalength: any;
  overDueSelectionForm!: FormGroup;
  pageCount: number = 10;
  filteredData: any[] = [];
  paginationIndex: number = 0;
  selectAllCheckbox!: FormControlName;
  tableHeaderAlignValue: string = 'left';
  selectAll = { isSelected: false };
  paymentData = [];
  totalAmoutToPay: number = 0;
  /*   displayedColumns: string[] = [
    'Select',
    'date',
    'invno',
    'invamount',
    'dueamount',
    'payment',
  ]; */

  columns: any[] = [
    {
      title: 'Invoice No',
      sortable: 0,
      name: 'vchno',
      needToShow: true,
    },

    {
      title: 'Invoice Date',
      sortable: 0,
      name: 'grndate',
      needToShow: true,
    },
    {
      title: ' Due Date',
      sortable: 0,
      name: 'dueon',
      needToShow: true,
    },
    {
      title: 'Invoice Amount',
      sortable: 0,
      name: 'invamount',
      needToShow: true,
    },
    {
      title: 'Due Amount',
      sortable: 0,
      name: 'dueamount',
      needToShow: true,
    },
    {
      title: 'Payment',
      sortable: 0,
      name: 'checked',
      needToShow: true,
    },
  ];

  constructor(
    public receiptapi: VoucherService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ListingTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.overDueSelectionForm = this.fb.group({
      selectAllCheckbox: [{ isSelected: false }],
      searchValues: [''],
      amountToPay: [],
      columnFilter: [
        {
          title: 'Invoice No',
          sortable: 0,
          name: 'vchno',
          needToShow: true,
        },

        {
          title: 'Invoice Date',
          sortable: 0,
          name: 'grndate',
          needToShow: true,
        },
        {
          title: ' Due Date',
          sortable: 0,
          name: 'dueon',
          needToShow: true,
        },
        {
          title: 'Invoice Amount',
          sortable: 0,
          name: 'invamount',
          needToShow: true,
        },
        {
          title: 'Due Amount',
          sortable: 0,
          name: 'dueamount',
          needToShow: true,
        },
        {
          title: 'Payment',
          sortable: 0,
          name: 'checked',
          needToShow: true,
        },
      ],
    });

    this.overDueSelectionForm.valueChanges.subscribe((res) => {
      console.log('resss changes', res);
    });
  }

  onSelectPaymentItem(itemIndex: any, pageIndex: any) {
    console.log('item Selection Change method', itemIndex, pageIndex);
    console.log('this.filteredData', this.filteredData);
    console.log('this.filteredData', this.filteredData[pageIndex][itemIndex]);

    this.filteredData[pageIndex][itemIndex].checked =
      !this.filteredData[pageIndex][itemIndex].checked;
    /*     if (!this.filteredData[pageIndex][itemIndex].checked) {
      this.filteredData[pageIndex][itemIndex].amountToPay = 0;
    } */
    console.log('filter data check toggle', this.filteredData);
    this.calculateNetAmount();
  }
  onClickNo(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    console.log('inside dialogdata', this.data);
    this.fetchPendingData(this.data.ledgerCode);
    this.overDueSelectionForm.valueChanges.subscribe((res) => {
      console.log('value changes sub', res);
    });
  }

  fetchPendingData(ledgerCode: any) {
    return new Promise((resolve) => {
      this.receiptapi
        .getPendingVendorInvoices(ledgerCode, this.data._branch, this.data._fy)
        .subscribe((res) => {
          console.log('res', res);

          if (JSON.parse(res).length > 0) {
            console.log('if');

            this.dataSource = new MatTableDataSource(JSON.parse(res));
            this.datalength = JSON.parse(res).length;
            console.log('dataSourse', this.dataSource);
            let data = new MatTableDataSource(JSON.parse(res)).filteredData;
            this.getFilterData(data);
          } else {
            console.log('else');

            this.datalength = 0;
            this.dataSource = new MatTableDataSource(JSON.parse(res));
            let data = new MatTableDataSource(JSON.parse(res)).filteredData;
            this.getFilterData(data);
          }
          resolve({ action: 'success' });
        });
    });
  }

  getFilterData(serverData: any) {
    console.log('i');

    let newArr: any[] = [];
    let rowIndex = 0;
    let rowCount = 0;

    for (let data of serverData) {
      console.log('data one', data);
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
  }

  onClickSelect() {}

  onClickCancel() {}

  applyFilter(event: any) {
    console.log('event', event);
  }

  changeMode(element: any, i: any) {}

  onAmountKeydown(itemIndex: any, pageIndex: any, event: any) {
    let amountEntered: number = event.target.value;
    console.log(amountEntered);
    this.filteredData[pageIndex][itemIndex].amountToPay = amountEntered;
    console.log('After Amount Entered', this.filteredData);
    this.calculateNetAmount();
  }
  calculateNetAmount() {
    let amountArray = this.filteredData
      .flatMap((item) => item)
      .filter((item) => item.checked == true);
    console.log('amountArray', amountArray);
    let amount: number = 0;
    for (let i = 0; i < amountArray.length; i++) {
      amount += Number(amountArray[i].amountToPay);
    }

    console.log('Amount', amount);
    this.totalAmoutToPay = amount;
  }
}
