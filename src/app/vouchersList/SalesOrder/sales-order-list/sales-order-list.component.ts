import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  VendorDropDown,
  dateFilterOptions,
  dropDownData,
  exportOptions,
  statusOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { Router } from '@angular/router';
import { ConfirmationDialogBoxComponent } from 'src/app/shared/components/confirmation-dialog-box/confirmation-dialog-box.component';
import { SoService } from 'src/app/services/so.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.scss'],
})
export class SalesOrderListComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
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
  loading: boolean = true;

  columns: any[] = [
    {
      title: 'Order Id',
      sortable: 0,
      name: 'sono',
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
    { title: 'Date & Time', sortable: 0, name: 'date', needToShow: true },
    { title: 'Back Order Qty', sortable: 0, name: 'ordered', needToShow: true },
    {
      title: 'Order Value',
      sortable: 0,
      name: 'orderedvalue',
      needToShow: true,
    },
    { title: 'Status', sortable: 0, name: 'pending', needToShow: true },
    { title: 'Action', sortable: 0, name: '', needToShow: true },
  ];

  constructor(
    private salesOrderApi: SoService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router
  ) {
    this.salesOrderForm = this.fb.group({
      SelectSaveOptions: [exportOptions[0].id],
      filterData: [dateFilterOptions[3].id],
      startDate: [''],
      searchValues: [''],
      endDate: [''],
      vendorcode: [''],
      reportStatus: [''],
      selectAllCheckbox: [{ isSelected: false }],
      columnFilter: [
        {
          title: 'Order Id',
          sortable: 0,
          name: 'sono',
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
        { title: 'Date & Time', sortable: 0, name: 'date', needToShow: true },
        {
          title: 'Back Order Qty',
          sortable: 0,
          name: 'ordered',
          needToShow: true,
        },
        {
          title: 'Order Value',
          sortable: 0,
          name: 'orderedvalue',
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

  onClickEdit(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogBoxComponent, {
      data: {
        iconToDisplay: 'EditData',
        contentText: 'Do You Want To Modify Data ?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigateByUrl('soupdate/' + encodeURIComponent(data.sono));
      }
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
    dialogRef.afterClosed().subscribe((result) => {});
  }

  onClickCancelOrder() {
    const dialogRef = this.dialog.open(ConfirmationDialogBoxComponent, {
      data: {
        iconToDisplay: 'DeleteFile',
        contentText: 'Do You Want To Cancel Order ?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  onClickViewMore(data: any) {
    this.router.navigate(['/sales-order-details'], {
      queryParams: { id: data.id },
    });
  }

  getFilterData(serverData: any) {
    this.cardsDetails = [
      {
        icon: 'bi bi-cash-stack',
        title: 'Total Sales Order',
        count: serverData.total,
        cardIconStyles: 'display:flex; color: #419FC7;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#419FC733',
        badgeStyles: 'background-color:#9FD24E33;color: #9FD24E',
        badgeValue: '100%',
        neededRupeeSign: false,
      },
      {
        icon: 'bi bi-cart-check',
        count: serverData.completed,
        title: 'Completed Sales Order',
        cardIconStyles: 'display:flex; color: #9FD24E',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#9FD24E33',
        badgeStyles: 'background-color:#9FD24E33;color: #9FD24E',
        badgeValue: `${Number.parseFloat(serverData.completedPercent).toFixed(
          2
        )}%`,
        neededRupeeSign: false,
      },
      {
        icon: 'bi bi-cart-dash',
        title: 'Pending Sales Order',
        count: serverData.pending,
        cardIconStyles: 'display:flex; color: #FFCB7C;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#FFCB7C33',
        badgeStyles: 'background-color:#FFCB7C33;color: #FFCB7C',
        badgeValue: `${Number.parseFloat(serverData.pendingPercent).toFixed(
          2
        )}%`,
        neededRupeeSign: false,
      },
      {
        icon: 'bi bi-cart-x',
        title: 'Cancelled Sales Order',
        count: serverData.cancelled,
        cardIconStyles: 'display:flex; color: #F04438;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#F0443833',
        badgeStyles: 'background-color:#F0443833;color: #F04438',
        badgeValue: `${Number.parseFloat(serverData.cancelledPercent).toFixed(
          2
        )}%`,
        neededRupeeSign: false,
      },
      {
        icon: 'bi bi-wallet',
        title: 'Sales Order Value',
        count: serverData.totalAmounts,
        cardIconStyles: 'display:flex; color: #41A0C8;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#41A0C833',
        neededRupeeSign: true,
      },
    ];

    let newArr: any[] = [];
    let rowIndex = 0;
    let rowCount = 0;
    let sortedData = serverData.result.sort((a: any, b: any) => {
      const nameA = Number(a.sono.split('/')[0]); // ignore upper and lowercase
      const nameB = Number(b.sono.split('/')[0]); // ignore upper and lowercase
      if (nameA < nameB) {
        return 1;
      }
      if (nameA > nameB) {
        return -1;
      }
      return 0;
    });

    for (let data of sortedData) {
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
  }

  loadData(formValues?: any, isInitialFetchData: boolean = false) {
    let firstDate;
    let lastDate;

    if (
      (formValues?.startDate && !formValues?.endDate) ||
      (!formValues?.startDate && formValues?.endDate)
    ) {
      return;
    }

    if (formValues?.startDate && formValues?.endDate) {
      let firstDateformat = new Date(formValues?.startDate);
      let lastDateformat = new Date(formValues?.endDate);
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
      ledgerId: formValues.vendorcode,
      globalFilterId: formValues.filterData,
      search: formValues.searchValues,
      fromDate: firstDate,
      toDate: lastDate,
    };
    this.salesOrderApi.getAllSoList(params).subscribe((res: any) => {
      console.log(res, '-------------res');
      this.loading = false;
      if (isInitialFetchData) {
        const newMap = new Map();
        res.result
          .map((item: any) => {
            return {
              name: item.customername,
              id: item.customercode,
            };
          })
          .forEach((item: VendorDropDown) => newMap.set(item.id, item));
        this.vendorDropDownData = [...newMap.values()];
      }
      this.getFilterData(res);
    });
  }

  downloadAsPDF() {
    if (this.salesOrderForm.value.SelectSaveOptions === 0) {
      let topValue = 0;
      var data = this.contentToSave.nativeElement;
      let timeDuration: string =
        this.filterByOptions[this.salesOrderForm.value.filterData - 1].name;

      html2canvas(data, { scale: 2 }).then((canvas) => {
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p', 'pt', 'a4');
        pdf.text(' Sales Order Summary(' + timeDuration + ')', 200, 50);
        pdf.addImage(contentDataURL, 'PNG', 50, 100, 510, 140);
        pdf.addPage();

        let tableData = this.filteredSalesOrderData
          .flatMap((item) => item)
          .map((item) => {
            let result = '';
            let backOrderCount = item.ordered - item.received;
            if (item.received !== item.ordered) {
              result = 'pending';
            } else if (item.received === item.ordered) {
              result = 'completed';
            }
            return { ...item, status: result, backOrder: backOrderCount };
          });
        console.log(tableData, 'tabledata');
        pdf.setLineWidth(2);
        pdf.text('Recent Sales Order', 240, (topValue += 50));
        pdf.setFontSize(12);
        let startDate: String = this.salesOrderForm.value?.startDate.toString();
        let endDate: String = this.salesOrderForm.value?.endDate.toString();
        if (this.salesOrderForm.value.startDate != '')
          pdf.text(
            'From :' +
              startDate.substring(4, 14) +
              ' To : ' +
              endDate.substring(4, 14),
            50,
            (topValue += 70)
          );
        if (this.salesOrderForm.value.reportStatus != '')
          pdf.text(
            'Status : ' +
              this.reportStatusOptions[
                this.salesOrderForm.value.reportStatus - 1
              ].name,
            50,
            (topValue += 20)
          );
        if (this.salesOrderForm.value.vendorcode != '')
          pdf.text(
            'Vendor Name : ' + tableData[0]?.customername,
            50,
            (topValue += 20)
          );
        if (this.salesOrderForm.value.vendorcode != '')
          pdf.text(
            'Sales Person : ' + tableData[0]?.customername,
            50,
            (topValue += 20)
          );
        autoTable(pdf, {
          body: tableData,
          columns: [
            {
              header: 'Order Id',
              dataKey: 'sono',
            },
            {
              header: 'Vendor',
              dataKey: 'customername',
            },
            {
              header: 'Order Quantity',
              dataKey: 'ordered',
            },
            {
              header: 'Received Quantity',
              dataKey: 'received',
            },
            {
              header: 'Data & Time',
              dataKey: 'date',
            },
            {
              header: 'Back Order Quantity',
              dataKey: 'backOrder',
            },
            {
              header: 'Order Value',
              dataKey: 'orderedvalue',
            },
            {
              header: 'Status',
              dataKey: 'status',
            },
          ],
          startY: (topValue += 30),
          theme: 'striped',
        });
        pdf.save('Sales Order.pdf');
      });
    } else {
      //Code for Excel Format Download
      /* var blob = new Blob([html],{type: 'data:application/vnd.ms-excel' });
      var u = URL.createObjectURL(blob);
      window.open(u); */

      let element = document.getElementById('salesOrdersTable')!;

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      wb.Props = {
        Title: 'Sales Order List',
      };
      var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([['']]);
      var wsCols = [
        { wch: 7 },
        { wch: 15 },
        { wch: 45 },
        { wch: 20 },
        { wch: 20 },
        { wch: 35 },
        { wch: 20 },
        { wch: 30 },
      ];
      ws['!cols'] = wsCols;
      XLSX.utils.sheet_add_aoa(ws, [['Sales Order Summary']], { origin: 'E1' });
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            'So.No',
            'Order Id',
            'Vendor',
            'Order Quantity',
            'Received Quantity',
            'Date & Time',
            'Back Order Quantity',
            'Order Value',
            'Status',
          ],
        ],
        { origin: 'A3' }
      );
      XLSX.utils.sheet_add_dom(ws, element, { origin: 'A5' });
      XLSX.utils.book_append_sheet(wb, ws, 'Sales Order Summary');
      XLSX.writeFile(wb, 'SO Report.xlsx');
    }
  }
}
