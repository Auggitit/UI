import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/services/sales.service';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { VendorDropDown } from 'src/app/reports/sales-order-report/sales-order-report.component';
import {
  dateFilterOptions,
  dropDownData,
  exportOptions,
  statusOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { Router } from '@angular/router';
import { ConfirmationDialogBoxComponent } from 'src/app/shared/components/confirmation-dialog-box/confirmation-dialog-box.component';

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.scss'],
})
export class SalesOrderListComponent implements OnInit {
  form!: FormGroup;
  vendorDropDownData: any[] = [];
  salesOrderData: any[] = [];
  salesOrderForm!: FormGroup;
  cardsDetails: any[] = [];
  saveAsOptions: dropDownData[] = exportOptions;
  filterByOptions: dropDownData[] = dateFilterOptions;
  paginationIndex: number = 0;
  pageCount: number = 10;
  filteredSalesOrderData: any[] = [];
  isIconNeeded: boolean = true;
  reportStatusOptions: dropDownData[] = statusOptions;
  selectAllCheckbox!: FormControlName;
  selectAll = { isSelected: false };

  columns: any[] = [
    {
      title: 'Order Value',
      sortable: 0,
      name: 'orderedvalue',
      needToShow: true,
    },
    { title: 'Vendor', sortable: 0, name: 'sono', needToShow: true },
    {
      title: 'Order Qty',
      sortable: 0,
      name: 'ordered',
      needToShow: true,
    },
    { title: 'Received Qty', sortable: 0, name: 'received', needToShow: true },
    { title: 'Date & Time', sortable: 0, name: 'sodate', needToShow: true },
    { title: 'Back Order Qty', sortable: 0, name: 'ordered', needToShow: true },
    { title: 'Status', sortable: 0, name: 'pending', needToShow: true },
    { title: 'Action', sortable: 0, name: '', needToShow: true },
  ];

  constructor(
    private salesapi: SalesService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router
  ) {
    this.salesOrderForm = this.fb.group({
      SelectSaveOptions: [exportOptions[0].id],
      filterData: [dateFilterOptions[2].id],
      startDate: [''],
      endDate: [''],
      vendorcode: [''],
      reportStatus: [''],
      selectAllCheckbox: [{ isSelected: false }],
      columnFilter: [
        {
          title: 'Order Value',
          sortable: 0,
          name: 'orderedvalue',
          needToShow: true,
        },
        { title: 'Vendor', sortable: 0, name: 'sono', needToShow: true },
        {
          title: 'Order Qty',
          sortable: 0,
          name: 'ordered',
          needToShow: true,
        },
        { title: 'Received Qty', sortable: 0, name: 'pname', needToShow: true },
        { title: 'Date & Time', sortable: 0, name: 'sodate', needToShow: true },
        {
          title: 'Back Order Qty',
          sortable: 0,
          name: 'ordered',
          needToShow: true,
        },
        {
          title: 'Status',
          sortable: 0,
          name: 'orderedvalue',
          needToShow: true,
        },
        { title: 'Action', sortable: 0, name: 'pending', needToShow: true },
      ],
    });
  }

  ngOnInit(): void {
    this.loadData(this.salesOrderForm.value, true);
    this.salesOrderForm.valueChanges.subscribe((values) => {
      this.loadData(values);
    });
  }

  gotoReportsPage(): void {
    this.router.navigateByUrl('so-report');
  }

  onClickButton(): void {
    this.router.navigateByUrl('so');
  }

  getFilterData(formValues: any, serverData: any) {
    this.cardsDetails = [
      {
        icon: 'bi bi-cash-stack',
        title: 'Total Sales Order',
        count: serverData.totalSOs,
        cardIconStyles: 'display:flex; color: #419FC7;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#419FC733',
        badgeStyles: 'background-color:#9FD24E33;color: #9FD24E',
        badgeValue: '100%',
        neededRupeeSign: false,
      },
      {
        icon: 'bi bi-cart-check',
        count: serverData.completedSOs,
        title: 'Completed Sales Order',
        cardIconStyles: 'display:flex; color: #9FD24E',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#9FD24E33',
        badgeStyles: 'background-color:#9FD24E33;color: #9FD24E',
        badgeValue: `${Number.parseFloat(
          serverData.completedSOsPercent
        ).toFixed(2)}%`,
        neededRupeeSign: false,
      },
      {
        icon: 'bi bi-cart-dash',
        title: 'Pending Sales Order',
        count: serverData.pendingSOs,
        cardIconStyles: 'display:flex; color: #FFCB7C;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#FFCB7C33',
        badgeStyles: 'background-color:#FFCB7C33;color: #FFCB7C',
        badgeValue: `${Number.parseFloat(serverData.pendingSOsPercent).toFixed(
          2
        )}%`,
        neededRupeeSign: false,
      },
      {
        icon: 'bi bi-cart-x',
        title: 'Cancelled Sales Order',
        count: serverData.cancelledSOs,
        cardIconStyles: 'display:flex; color: #F04438;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#F0443833',
        badgeStyles: 'background-color:#F0443833;color: #F04438',
        badgeValue: `${Number.parseFloat(
          serverData.cancelledSOsPercent
        ).toFixed(2)}%`,
        neededRupeeSign: false,
      },
      {
        icon: 'bi bi-wallet',
        title: 'Sales Order Value',
        count: serverData.salesOrderValue,
        cardIconStyles: 'display:flex; color: #41A0C8;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#41A0C833',
        // badgeStyles: 'background-color:#9FD24E33;color: #9FD24E',
        // badgeValue: '+23%',
        neededRupeeSign: true,
      },
    ];

    let newArr: any[] = [];
    let rowIndex = 0;
    let rowCount = 0;
    for (let data of serverData.solists) {
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
    this.filteredSalesOrderData = newArr;

    let seriesData: any[] = [];
    let graphLabels = [
      ['Yesterday', 'Today'],
      ['Last Week', 'This Week'],
      ['Last Month', 'This Month'],
      ['Last Year', 'This Year'],
    ];

    if (serverData.graphData.length) {
      for (let [index, value] of serverData.graphData.entries()) {
        let graphValue = Object.entries(value).sort();
        let graphArrayData = [];
        for (let item of graphValue) {
          graphArrayData.push(item[1]);
        }
        seriesData.push({
          name: graphLabels[formValues.filterData - 1][index],
          color: index == 0 ? '#E46A11' : '#419FC7',
          data: graphArrayData,
        });
      }
    }
    console.log(seriesData, 'series data');
  }

  loadData(formValues: any, isInitialFetchData: boolean = false) {
    let params = {
      statusId: formValues.reportStatus,
      vendorId: formValues.vendorcode,
      globalFilterId: formValues.filterData,
      search: formValues.searchValues,
      // fromDate: formValues.startDate,
      // toDate: formValues.toDate,
    };
    this.salesapi.getAllSoList(params).subscribe((res: any) => {
      if (res.solists.length) {
        if (isInitialFetchData) {
          const newMap = new Map();
          res.solists
            .map((item: any) => {
              return {
                name: item.vendorname,
                id: item.vendorcode,
              };
            })
            .forEach((item: VendorDropDown) => newMap.set(item.id, item));
          this.vendorDropDownData = [...newMap.values()];
        }
        console.log(res, 'response...........');
        this.getFilterData(formValues, res);
      }
    });
  }
  onClickEdit() {
    console.log('Clicked Edit');
    const dialogRef = this.dialog.open(ConfirmationDialogBoxComponent, {
      data: {
        iconToDisplay: 'EditData',
        contentText: 'Do You Want To Modify Data ?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  onClickDelete() {
    console.log('Clicked Delete');
    const dialogRef = this.dialog.open(ConfirmationDialogBoxComponent, {
      data: {
        iconToDisplay: 'DeleteFile',
        contentText: 'Do You Want To Delete Data ?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  onClickCancelOrder() {
    console.log('Clicked Delete');
    const dialogRef = this.dialog.open(ConfirmationDialogBoxComponent, {
      data: {
        iconToDisplay: 'DeleteFile',
        contentText: 'Do You Want To Cancel Order ?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  onClickViewMore() {
    console.log('Clicked View More');
  }
}
