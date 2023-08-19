import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  dateFilterOptions,
  dropDownData,
  exportOptions,
  statusOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { SoService } from 'src/app/services/so.service';
import { ConfirmationDialogBoxComponent } from 'src/app/shared/components/confirmation-dialog-box/confirmation-dialog-box.component';
import { VendorDropDown } from '../service-sales-order-report/service-sales-order-report.component';
import { SsoService } from 'src/app/services/sso.service';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-sales-order-list',
  templateUrl: './service-sales-order-list.component.html',
  styleUrls: ['./service-sales-order-list.component.scss'],
})
export class ServiceSalesOrderListComponent implements OnInit {
  form!: FormGroup;
  vendorDropDownData: any[] = [];
  serviceSalesOrderData: any[] = [];
  serviceSalesOrderForm!: FormGroup;
  cardsDetails: any[] = [];
  saveAsOptions: dropDownData[] = exportOptions;
  filterByOptions: dropDownData[] = dateFilterOptions;
  paginationIndex: number = 0;
  pageCount: number = 10;
  filteredServiceSalesOrderData: any[] = [];
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
    private serviceSOApi: SsoService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router
  ) {
    this.serviceSalesOrderForm = this.fb.group({
      SelectSaveOptions: [exportOptions[0].id],
      filterData: [dateFilterOptions[3].id],
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
        {
          title: 'Received Qty',
          sortable: 0,
          name: 'received',
          needToShow: true,
        },
        { title: 'Date & Time', sortable: 0, name: 'sodate', needToShow: true },
        {
          title: 'Back Order Qty',
          sortable: 0,
          name: 'ordered',
          needToShow: true,
        },
        { title: 'Status', sortable: 0, name: 'pending', needToShow: true },
        { title: 'Action', sortable: 0, name: '', needToShow: true },
      ],
    });
  }

  ngOnInit(): void {
    this.loadData(this.serviceSalesOrderForm.value, true);
    this.serviceSalesOrderForm.valueChanges.subscribe((values) => {
      this.loadData(values);
    });
  }

  gotoReportsPage(): void {
    this.router.navigateByUrl('service-sales-order-reports');
  }

  onClickButton(): void {
    this.router.navigateByUrl('soservice');
  }

  getFilterData(serverData: any) {
    this.cardsDetails = [
      {
        icon: 'bi bi-cash-stack',
        title: 'Total Service SO',
        count: serverData.totalOrders,
        cardIconStyles: 'display:flex; color: #419FC7;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#419FC733',
        badgeStyles: 'background-color:#9FD24E33;color: #9FD24E',
        badgeValue: '100%',
      },
      {
        icon: 'bi bi-cart-check',
        count: serverData.completedOrders,
        title: 'Completed Service SO',
        cardIconStyles: 'display:flex; color: #9FD24E',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#9FD24E33',
        badgeStyles: 'background-color:#9FD24E33;color: #9FD24E',
        badgeValue: `${Number.parseFloat(
          serverData.completedOrdersPercent
        ).toFixed(2)}%`,
      },
      {
        icon: 'bi bi-cart-dash',
        title: 'Pending Service SO',
        count: serverData.pendingOrders,
        cardIconStyles: 'display:flex; color: #FFCB7C;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#FFCB7C33',
        badgeStyles: 'background-color:#FFCB7C33;color: #FFCB7C',
        badgeValue: `${Number.parseFloat(
          serverData.pendingOrdersPercent
        ).toFixed(2)}%`,
      },
      {
        icon: 'bi bi-cart-x',
        title: 'Cancelled  Service SO',
        count: serverData.cancelledOrders,
        cardIconStyles: 'display:flex; color: #F04438;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#F0443833',
        badgeStyles: 'background-color:#F0443833;color: #F04438',
        badgeValue: `${Number.parseFloat(
          serverData.cancelledOrdersPercent
        ).toFixed(2)}%`,
      },
      {
        icon: 'bi bi-wallet',
        title: 'Service SO Value',
        count: serverData.orderValues,
        cardIconStyles: 'display:flex; color: #41A0C8;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#41A0C833',
        // badgeStyles: 'background-color:#9FD24E33;color: #9FD24E',
        // badgeValue: '+23%',
      },
    ];

    let newArr: any[] = [];
    let rowIndex = 0;
    let rowCount = 0;
    for (let data of serverData.orders) {
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

    this.filteredServiceSalesOrderData = newArr;

    console.log('data in table', this.filteredServiceSalesOrderData);
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
  deletepo(data: any) {
    console.log(data, '.......data');

    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: 'Do you Delete data?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(data);
        this.serviceSOApi.Delete_SO(data.sono).subscribe((res) => {
          this.serviceSOApi.Delete_SODetails(data.sono).subscribe((res) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'PO ' + data.pono + ' Deleted Successfully',
            });
            this.loadData();
          });
        });
      }
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

  onClickViewMore(data: any) {
    this.router.navigate(['/service-sales-details'], {
      queryParams: { sono: data.sono },
    });
  }

  loadData(formValues?: any, isInitialFetchData: boolean = false) {
    let firstDate;
    let lastDate;
    if (formValues?.startDate) {
      let firstDateformat = new Date(formValues?.startDate);
      let lastDateformat = new Date(formValues?.startDate);
      let firstDateSplit = firstDateformat
        ?.toISOString()
        .split('T')[0]
        .split('-');
      let lastDateSplit = lastDateformat
        ?.toISOString()
        .split('T')[0]
        .split('-');
      firstDate =
        firstDateSplit[2] + '/' + firstDateSplit[1] + '/' + firstDateSplit[0];
      lastDate =
        lastDateSplit[2] + '/' + lastDateSplit[1] + '/' + lastDateSplit[0];
    }
    let params = {
      statusId: formValues.reportStatus,
      vendorId: formValues.vendorcode,
      globalFilterId: formValues.filterData,
      search: formValues.searchValues,
      fromDate: firstDate,
      toDate: lastDate,
    };
    this.serviceSOApi.getAllServiceSoList(params).subscribe((res: any) => {
      console.log(res, '-------------res');
      // if (res.orders.length) {
        if (isInitialFetchData) {
          const newMap = new Map();
          res.orders
            .map((item: any) => {
              return {
                name: item.vendorname,
                id: item.vendorcode,
              };
            })
            .forEach((item: VendorDropDown) => newMap.set(item.id, item));
          this.vendorDropDownData = [...newMap.values()];
        }
        this.getFilterData(res);
      // }
    });
  }
}
