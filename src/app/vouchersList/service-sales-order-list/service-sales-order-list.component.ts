import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogBoxComponent } from './../../shared/components/confirmation-dialog-box/confirmation-dialog-box.component';
import { Router } from '@angular/router';
import { SsalesService } from 'src/app/services/ssales.service';
import {
  dateFilterOptions,
  dropDownData,
  exportOptions,
  statusOptions,
} from 'src/app/reports/stub/salesOrderStub';

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
    private salesapi: SsalesService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router
  ) {
    this.serviceSalesOrderForm = this.fb.group({
      SelectSaveOptions: [exportOptions[0].id],
      filterData: [dateFilterOptions[0].id],
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
    this.loadData();
    this.serviceSalesOrderForm.valueChanges.subscribe((values) => {
      this.getFilterData(values, this.serviceSalesOrderData);
    });
  }

  gotoReportsPage(): void {
    this.router.navigateByUrl('service-sales-order-reports');
  }

  onClickButton(): void {
    this.router.navigateByUrl('soservice');
  }

  getFilterData(formValues: any, serverData: any): void {
    let updatedValue: any[] = serverData;
    console.log(updatedValue, 'updated value');

    if (formValues.vendorcode) {
      updatedValue = updatedValue.filter(
        (itm) => itm.vendorcode == formValues.vendorcode
      );
    }

    if (formValues.startDate && formValues.endDate) {
      updatedValue = updatedValue.filter((itm) => {
        let sodate = itm.sodate;
        let splited = sodate.split(' ')[0].split('-');
        let formatedDate = splited[1] + '/' + splited[0] + '/' + splited[2];
        let dateF = new Date(formatedDate).toISOString();
        return (
          dateF >= new Date(formValues.startDate).toISOString() &&
          dateF <= new Date(formValues.endDate).toISOString()
        );
      });
    }

    if (formValues.filterData) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const sunday = new Date(now);
      const saturday = new Date(now);
      sunday.setDate(sunday.getDate() - sunday.getDay() + 1);
      saturday.setDate(saturday.getDate() - saturday.getDay() + 7);
      if (formValues.filterData) {
        updatedValue = updatedValue.filter((item: any) => {
          let sodate = item.sodate;
          let splited = sodate.split(' ')[0].split('-');
          let formatedDate = splited[2] + '-' + splited[1] + '-' + splited[0];

          if (formValues.filterData === '0') {
            return item;
          }
          if (formValues.filterData === '1') {
            return (
              new Date(formatedDate).toISOString().split('T')[0] ===
              new Date().toISOString().split('T')[0]
            );
          }
          if (formValues.filterData === '2') {
            return (
              new Date(formatedDate).toISOString() >= sunday.toISOString() &&
              new Date(formatedDate).toISOString() <= saturday.toISOString()
            );
          }
          if (formValues.filterData === '3') {
            return new Date(formatedDate).getMonth() == now.getMonth();
          }
          if (formValues.filterData === '4') {
            return new Date(formatedDate).getFullYear() == now.getFullYear();
          }
          return;
        });
      }
    }
    let newArr: any[] = [];
    let rowIndex = 0;
    let rowCount = 0;
    for (let data of updatedValue) {
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

    this.cardsDetails = [
      {
        icon: 'bi bi-cash-stack',
        title: 'Total Service Sales Order',
        count: updatedValue.length,
        cardIconStyles: 'display:flex; color: #419FC7;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#419FC733',
        badgeStyles: 'background-color:#9FD24E33;color: #9FD24E',
        badgeValue: '+7.5%',
      },
      {
        icon: 'bi bi-cart-check',
        count: updatedValue.filter((itm) => Number(itm.received)).length,
        title: 'Completed Service Sales Order',
        cardIconStyles: 'display:flex; color: #9FD24E',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#9FD24E33',
        badgeStyles: 'background-color:#9FD24E33;color: #9FD24E',
        badgeValue: '+1.5%',
      },
      {
        icon: 'bi bi-cart-dash',
        title: 'Pending Service Sales Order',
        count: updatedValue.filter((itm) => Number(itm.received === '0'))
          .length,
        cardIconStyles: 'display:flex; color: #FFCB7C;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#FFCB7C33',
        badgeStyles: 'background-color:#FFCB7C33;color: #FFCB7C',
        badgeValue: '-2%',
      },
      {
        icon: 'bi bi-cart-x',
        title: 'Cancelled Service Sales Order',
        count: updatedValue.filter((itm) => Number(itm.pending) === 0).length,
        cardIconStyles: 'display:flex; color: #F04438;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#F0443833',
        badgeStyles: 'background-color:#F0443833;color: #F04438',
        badgeValue: '-13%',
      },
      {
        icon: 'bi bi-wallet',
        title: 'Service Sales Order Value',
        count: Math.round(
          updatedValue.reduce(
            (prev: any, curr: any) => Number(prev) + Number(curr.orderedvalue),
            0
          )
        ),
        cardIconStyles: 'display:flex; color: #41A0C8;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#41A0C833',
        badgeStyles: 'background-color:#9FD24E33;color: #9FD24E',
        badgeValue: '+23%',
      },
    ];
    console.log('data in table', this.filteredServiceSalesOrderData);
  }

  loadData() {
    this.salesapi.getPendingSOListSOService().subscribe((res: any[]) => {
      if (res.length) {
        const newMap = new Map();
        res
          .map((item: any) => {
            return {
              name: item.vendorname,
              id: item.vendorcode,
            };
          })
          .forEach((item: dropDownData) => newMap.set(item.id, item));
        this.vendorDropDownData = [...newMap.values()];
        this.serviceSalesOrderData = res;
        this.getFilterData(this.serviceSalesOrderForm.value, res);

        console.log(
          this.serviceSalesOrderData,
          this.vendorDropDownData,
          'Service sales order data'
        );
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
