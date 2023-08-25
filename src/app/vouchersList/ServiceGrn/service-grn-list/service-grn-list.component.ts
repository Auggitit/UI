import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  VendorDropDown,
  dateFilterOptions,
  dropDownData,
  exportOptions,
  statusOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ConfirmationDialogBoxComponent } from 'src/app/shared/components/confirmation-dialog-box/confirmation-dialog-box.component';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { GrnserviceService } from 'src/app/services/grnservice.service';

@Component({
  selector: 'app-service-grn-list',
  templateUrl: './service-grn-list.component.html',
  styleUrls: ['./service-grn-list.component.scss'],
})
export class ServiceGrnListComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  form!: FormGroup;
  vendorDropDownData: any[] = [];
  serviceGrnForm!: FormGroup;
  cardsDetails: any[] = [];
  saveAsOptions: dropDownData[] = exportOptions;
  filterByOptions: dropDownData[] = dateFilterOptions;
  paginationIndex: number = 0;
  pageCount: number = 10;
  filteredServiceGrnData: any[] = [];
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
    { title: 'Vendor', sortable: 0, name: 'pono', needToShow: true },
    {
      title: 'Order Qty',
      sortable: 0,
      name: 'ordered',
      needToShow: true,
    },
    { title: 'Received Qty', sortable: 0, name: 'received', needToShow: true },
    { title: 'Date & Time', sortable: 0, name: 'date', needToShow: true },
    { title: 'Back Order Qty', sortable: 0, name: 'ordered', needToShow: true },
    { title: 'Status', sortable: 0, name: 'pending', needToShow: true },
    { title: 'Action', sortable: 0, name: '', needToShow: true },
  ];

  constructor(
    private serviceGrnApi: GrnserviceService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router
  ) {
    this.serviceGrnForm = this.fb.group({
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
        { title: 'Vendor', sortable: 0, name: 'pono', needToShow: true },
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
        { title: 'Date & Time', sortable: 0, name: 'date', needToShow: true },
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
    this.loadData(this.serviceGrnForm.value, true);
    this.serviceGrnForm.valueChanges.subscribe((values) => {
      this.loadData(values);
    });
  }

  gotoReportsPage(): void {
    this.router.navigateByUrl('service-grn-report');
  }

  onClickButton(): void {
    this.router.navigateByUrl('servicegrn');
  }

  getFilterData(serverData: any) {
    this.cardsDetails = [
      {
        icon: 'bi bi-cash-stack',
        title: 'Total Service GRN',
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
        title: 'Completed Service GRN',
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
        title: 'Pending Service GRN',
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
        title: 'Cancelled  Service GRN',
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
        title: 'Service GRN Value',
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
    for (let data of serverData.result) {
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

    this.filteredServiceGrnData = newArr;

    console.log('data in table', this.filteredServiceGrnData);
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
    dialogRef.afterClosed().subscribe((result) => {});
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
    this.router.navigate(['/service-grn-details'], {
      queryParams: { id: data.id },
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
      ledgerId: formValues.vendorcode,
      globalFilterId: formValues.filterData,
      search: formValues.searchValues,
      fromDate: firstDate,
      toDate: lastDate,
    };
    this.serviceGrnApi.getAllServiceGrnList(params).subscribe((res: any) => {
      console.log(res, '-------------res');
      if (isInitialFetchData) {
        const newMap = new Map();
        res.result
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
    });
  }

  downloadAsPDF() {
    if (this.serviceGrnForm.value.SelectSaveOptions === 0) {
      let topValue = 0;
      var data = this.contentToSave.nativeElement;
      let timeDuration: string =
        this.filterByOptions[this.serviceGrnForm.value.filterData - 1].name;

      html2canvas(data, { scale: 2 }).then((canvas) => {
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p', 'pt', 'a4');
        pdf.text('Service GRN Summary(' + timeDuration + ')', 200, 50);
        pdf.addImage(contentDataURL, 'PNG', 50, 100, 510, 140);
        pdf.addPage();

        let tableData = this.filteredServiceGrnData.flatMap((item) => item);

        pdf.setLineWidth(2);
        pdf.text('Recent Service GRN', 240, (topValue += 50));
        pdf.setFontSize(12);
        let startDate: String = this.serviceGrnForm.value?.startDate.toString();
        let endDate: String = this.serviceGrnForm.value?.endDate.toString();
        if (this.serviceGrnForm.value.startDate != '')
          pdf.text(
            'From :' +
              startDate.substring(4, 14) +
              ' To : ' +
              endDate.substring(4, 14),
            50,
            (topValue += 70)
          );
        if (this.serviceGrnForm.value.reportStatus != '')
          pdf.text(
            'Status : ' +
              this.reportStatusOptions[
                this.serviceGrnForm.value.reportStatus - 1
              ].name,
            50,
            (topValue += 20)
          );
        if (this.serviceGrnForm.value.vendorcode != '')
          pdf.text(
            'Vendor Name : ' + tableData[0]?.vendorname,
            50,
            (topValue += 20)
          );
        if (this.serviceGrnForm.value.vendorcode != '')
          pdf.text(
            'Sales Person : ' + tableData[0]?.vendorname,
            50,
            (topValue += 20)
          );
        autoTable(pdf, {
          body: tableData,
          columns: [
            {
              header: 'Order Value',
              dataKey: 'orderedvalue',
            },
            {
              header: 'Vendor',
              dataKey: 'vendorname',
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
              dataKey: 'received',
            },
            {
              header: 'Status',
              dataKey: 'received',
            },
          ],
          startY: (topValue += 30),
          theme: 'striped',
        });
        pdf.save('Service GRN Report.pdf');
      });
    } else {
      //Code for Excel Format Download
      /* var blob = new Blob([html],{type: 'data:application/vnd.ms-excel' });
      var u = URL.createObjectURL(blob);
      window.open(u); */

      let element = document.getElementById('serviceGrnTable')!;

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      wb.Props = {
        Title: 'Service GRN Report',
      };
      var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([['']]);
      var wsCols = [
        { wch: 7 },
        { wch: 15 },
        { wch: 15 },
        { wch: 40 },
        { wch: 50 },
        { wch: 25 },
        { wch: 50 },
        { wch: 50 },
      ];
      ws['!cols'] = wsCols;
      XLSX.utils.sheet_add_aoa(ws, [['Service GRN Summary']], {
        origin: 'E1',
      });
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            'Order Value',
            'Vendor',
            'Order Quantity',
            'Received Quantity',
            'Date & Time',
            'Back Order Quantity',
            'Status',
          ],
        ],
        { origin: 'A3' }
      );
      XLSX.utils.sheet_add_dom(ws, element, { origin: 'A5' });
      XLSX.utils.book_append_sheet(wb, ws, 'Service GRN Summary');
      XLSX.writeFile(wb, 'Report.xlsx');
    }
  }
}