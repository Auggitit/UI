import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { ApexChart } from 'ng-apexcharts';
import {
  dateFilterOptions,
  dropDownData,
  exportOptions,
  statusOptions,
} from '../stub/salesOrderStub';
import { Subscription } from 'rxjs';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SalesService } from './../../services/sales.service';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';

export interface VendorDropDown {
  id: string;
  name: string;
}
@Component({
  selector: 'app-sales-order-report',
  templateUrl: './sales-order-report.component.html',
  styleUrls: ['./sales-order-report.component.scss'],
})
export class SalesOrderReportComponent implements OnInit, OnDestroy {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  formSubscription!: Subscription;
  statusId: any = 0;
  filteredSalesOrderData: any[] = [];
  vendorDropDownData: VendorDropDown[] = [];
  paginationIndex: number = 0;
  pageCount: number = 10;
  form!: FormGroup;
  orderValue: number = 0;
  confirmedStatus: number = 0;
  totalPending: number = 0;
  totalOrder: number = 0;
  cardsDetails: any[] = [];
  public chartOptions: any = {};
  isIconNeeded: boolean = true;
  searchSuggestionsList: string[] = ['SearchValue1', 'InputValue2', 'Value3'];
  saveAsOptions: dropDownData[] = exportOptions;
  filterByOptions: dropDownData[] = dateFilterOptions;
  reportStatusOptions: dropDownData[] = statusOptions;
  searchValues!: FormControlName;
  columnFilter!: FormControlName;
  selectAllCheckbox!: FormControlName;
  selectAll = { isSelected: false };
  columns: any[] = [
    { title: 'Order ID', sortable: 0, name: 'sono', needToShow: true },
    { title: 'Ref ID', sortable: 0, name: 'sono', needToShow: true },
    {
      title: 'Vendor Detail',
      sortable: 0,
      name: 'vendorname',
      needToShow: true,
    },
    { title: 'Product Detail', sortable: 0, name: 'pname', needToShow: true },
    { title: 'Date & Time', sortable: 0, name: 'sodate', needToShow: true },
    { title: 'Quantity', sortable: 0, name: 'ordered', needToShow: true },
    { title: 'Price', sortable: 0, name: 'orderedvalue', needToShow: true },
    { title: 'Status', sortable: 0, name: 'pending', needToShow: true },
  ];

  chartSpec: Partial<ApexChart> = {
    fontFamily: 'Inter',
    height: 265,
    type: 'area',
    toolbar: {
      show: false,
    },
  };

  constructor(
    private salesapi: SalesService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      vendorcode: [''],
      endDate: [''],
      startDate: [''],
      filterData: [dateFilterOptions[2].id],
      reportStatus: [''],
      SelectSaveOptions: [exportOptions[0].id],
      searchValues: [''],
      selectAllCheckbox: [{ isSelected: false }],
      columnFilter: [
        { title: 'Order ID', sortable: 0, name: 'sono', needToShow: true },
        { title: 'Ref ID', sortable: 0, name: 'sono', needToShow: true },
        {
          title: 'Vendor Detail',
          sortable: 0,
          name: 'vendorname',
          needToShow: true,
        },
        {
          title: 'Product Detail',
          sortable: 0,
          name: 'pname',
          needToShow: true,
        },
        { title: 'Date & Time', sortable: 0, name: 'sodate', needToShow: true },
        { title: 'Quantity', sortable: 0, name: 'ordered', needToShow: true },
        { title: 'Price', sortable: 0, name: 'orderedvalue', needToShow: true },
        { title: 'Status', sortable: 0, name: 'pending', needToShow: true },
      ],
    });
  }

  onClickNext(): void {
    this.paginationIndex += 1;
  }

  onClickPrev(): void {
    this.paginationIndex -= 1;
  }

  onClickPaginationNo(i: number): void {
    this.paginationIndex = i;
  }

  ngOnInit(): void {
    this.loadData(this.form.value, true);
    this.formSubscription = this.form.valueChanges.subscribe((values) => {
      this.loadData(values);
    });
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

    this.chartOptions = {
      series: seriesData,
      chart: this.chartSpec,
      dataLabels: {
        enabled: false,
      },
      fill: {
        colors: ['#419FC7', '#E46A11'],
        gradient: {
          opacityFrom: 0.38,
          opacityTo: 0.2,
        },
      },
      stroke: {
        colors: ['#E46A11', '#419FC7'],
        curve: 'smooth',
      },
      xaxis: {
        categories: Object.keys(serverData.graphData[0]).sort(),
      },
    };
  }

  loadData(formValues?: any, isInitialFetchData: boolean = false) {
    let params = {
      statusId: formValues.reportStatus,
      vendorId: formValues.vendorcode,
      globalFilterId: formValues.filterData,
      search: formValues.searchValues,
      fromDate: formValues.startDate,
      toDate: formValues.toDate,
    };

    console.log(formValues.startDate, 'start date');

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

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  downloadAsPDF() {
    if (this.form.value.SelectSaveOptions === 0) {
      let topValue = 0;
      var data = this.contentToSave.nativeElement;
      let timeDuration: string =
        this.filterByOptions[this.form.value.filterData].name;
      console.log(timeDuration, 'timeduration');

      html2canvas(data, { scale: 2 }).then((canvas) => {
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p', 'pt', 'a4');
        pdf.text(' Sales Order Summary(' + timeDuration + ')', 200, 50);
        pdf.addImage(contentDataURL, 'PNG', 50, 100, 510, 280);
        pdf.addPage();

        let tableData = this.filteredSalesOrderData.flatMap((item) => item);
        console.log('Fil dat dabhg', tableData);

        pdf.setLineWidth(2);
        pdf.text('Recent Sales Order', 240, (topValue += 50));
        pdf.setFontSize(12);
        let startDate: String = this.form.value?.startDate.toString();
        let endDate: String = this.form.value?.endDate.toString();
        console.log('=======Form Values========', this.form.value);
        if (this.form.value.startDate != '')
          pdf.text(
            'From :' +
              startDate.substring(4, 14) +
              ' To : ' +
              endDate.substring(4, 14),
            50,
            (topValue += 70)
          );
        if (this.form.value.reportStatus != '')
          pdf.text(
            'Status : ' +
              this.reportStatusOptions[this.form.value.reportStatus].name,
            50,
            (topValue += 20)
          );
        if (this.form.value.vendorcode != '')
          pdf.text(
            'Vendor Name : ' + tableData[0]?.vendorname,
            50,
            (topValue += 20)
          );
        if (this.form.value.vendorcode != '')
          pdf.text(
            'Sales Person : ' + tableData[0]?.vendorname,
            50,
            (topValue += 20)
          );
        autoTable(pdf, {
          body: tableData,
          columns: [
            {
              header: 'Order ID',
              dataKey: 'sono',
            },
            {
              header: 'Ref ID',
              dataKey: 'vendorcode',
            },
            {
              header: 'Vendor Detail',
              dataKey: 'vendorname',
            },
            {
              header: 'Product Detail',
              dataKey: 'vendorname',
            },
            {
              header: 'Data & Time',
              dataKey: 'sodate',
            },
            {
              header: 'Quantity',
              dataKey: 'ordered',
            },
            {
              header: 'Price',
              dataKey: 'orderedvalue',
            },
            {
              header: 'Status',
              dataKey: 'received',
            },
          ],
          startY: (topValue += 30),
          theme: 'striped',
        });
        pdf.save('Sales Report.pdf');
      });
    } else {
      //Code for Excel Format Download
      /* var blob = new Blob([html],{type: 'data:application/vnd.ms-excel' });
      var u = URL.createObjectURL(blob);
      window.open(u); */

      let element = document.getElementById('salesOrdersTable')!;

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      wb.Props = {
        Title: 'Sales Order Report',
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
      XLSX.utils.sheet_add_aoa(ws, [['Sales Order Summary']], { origin: 'E1' });
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            'Sr No',
            'Order ID',
            'Ref ID',
            'Vendor Detail',
            'Product Detail',
            'Date & Time',
            'Quantity',
            'Price',
            'Status',
          ],
        ],
        { origin: 'A3' }
      );
      XLSX.utils.sheet_add_dom(ws, element, { origin: 'A5' });
      XLSX.utils.book_append_sheet(wb, ws, 'Sales Order Summary');
      XLSX.writeFile(wb, 'Report.xlsx');
    }
  }
}
