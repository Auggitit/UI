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
  TodayChartCategories,
  WeekChartCategories,
  areaChartCategories,
  dateFilterOptions,
  dropDownData,
  exportOptions,
  monthChartCategories,
  statusOptions,
} from '../stub/salesOrderStub';
import { Subscription, startWith } from 'rxjs';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SalesService } from './../../services/sales.service';
import * as XLSX from 'xlsx';

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
  salesOrderData!: any[];
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
  selectAllCheckbox!:FormControlName;
  selectAll={isSelected:false};
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

  constructor(private salesapi: SalesService, private fb: FormBuilder) {
    this.form = this.fb.group({
      vendorcode: [''],
      endDate: [''],
      startDate: [''],
      filterData: [dateFilterOptions[0].id],
      reportStatus: [''],
      SelectSaveOptions: [exportOptions[0].id],
      searchValues: [''],
      selectAllCheckbox:[{isSelected:false}],
      columnFilter:  [
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
    this.loadData();
    this.formSubscription = this.form.valueChanges.subscribe((values) => {
      console.log("--------",values)
      this.getFilterData(values, this.salesOrderData);
    });
  }
 
  onClickCreateNewOrderButton() {
    // console.log('Create New Order Button Clicked');
  }

  getFilterData(formValues: any, serverData: any): void {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let updatedValue: any[] = serverData;
    let selectedYear = new Date().getFullYear();
    const previousYear = new Date().getFullYear() - 1;
    const LastMonth = new Date().getMonth() - 1;
    const ThisMonth = new Date().getMonth();
    const sunday = new Date(now);
    const saturday = new Date(now);
    sunday.setDate(sunday.getDate() - sunday.getDay());
    saturday.setDate(saturday.getDate() - saturday.getDay() + 6);
    const firstOfLastWeek = new Date(now);
    firstOfLastWeek.setDate(
      firstOfLastWeek.getDate() - firstOfLastWeek.getDay() - 7
    );
    const endOfLastWeek = new Date(now);

    endOfLastWeek.setDate(endOfLastWeek.getDate() - endOfLastWeek.getDay() - 1);
    let chartFilterData: any[] = [];

    if (formValues.vendorcode) {
      updatedValue = updatedValue.filter(
        (itm) => itm.vendorcode == formValues.vendorcode
      );
    }
    chartFilterData = updatedValue;

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
    this.filteredSalesOrderData = newArr;

    this.cardsDetails = [
      {
        icon: 'bi bi-cash-stack',
        title: 'Total Sales Order',
        count: updatedValue.length,
        cardIconStyles: 'display:flex; color: #419FC7;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#419FC733',
        badgeStyles: 'background-color:#9FD24E33;color: #9FD24E',
        badgeValue: '+7.5%',
        neededRupeeSign: false,
      },
      {
        icon: 'bi bi-cart-check',
        count: updatedValue.filter((itm) => Number(itm.pending) === 0).length,
        title: 'Completed Sales Order',
        cardIconStyles: 'display:flex; color: #9FD24E',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#9FD24E33',
        badgeStyles: 'background-color:#9FD24E33;color: #9FD24E',
        badgeValue: '+1.5%',
        neededRupeeSign: false,
      },
      {
        icon: 'bi bi-cart-dash',
        title: 'Pending Sales Order',
        count: updatedValue.filter((itm) => Number(itm.pending) > 0).length,
        cardIconStyles: 'display:flex; color: #FFCB7C;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#FFCB7C33',
        badgeStyles: 'background-color:#FFCB7C33;color: #FFCB7C',
        badgeValue: '-2%',
        neededRupeeSign: false,
      },
      {
        icon: 'bi bi-cart-x',
        title: 'Cancelled Sales Order',
        count: updatedValue.filter((itm) => Number(itm.pending) === 0).length,
        cardIconStyles: 'display:flex; color: #F04438;z-index:100',
        iconBackStyles:
          'max-width: fit-content; padding:12px;background-color:#F0443833',
        badgeStyles: 'background-color:#F0443833;color: #F04438',
        badgeValue: '-13%',
        neededRupeeSign: false,
      },
      {
        icon: 'bi bi-wallet',
        title: 'Sales Order Value',
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
        neededRupeeSign: true,
      },
    ];

    const chartMapData = new Map();
    let seriesData: any[] = [];
    const productSales: any[] = [];
    let chartCategories = areaChartCategories;
    // this year
    if (formValues?.filterData == '0' || formValues?.filterData == '4') {
      let yearFilter = chartFilterData.filter((item: any) => {
        let sodate = item.sodate;
        let splited = sodate.split(' ')[0].split('-');
        let formatedDate = splited[2] + '-' + splited[1] + '-' + splited[0];

        return (
          new Date(formatedDate).getFullYear() === new Date().getFullYear() ||
          new Date(formatedDate).getFullYear() === previousYear
        );
      });
      for (let i of yearFilter) {
        let sodate = i.sodate;
        let splited = sodate.split(' ')[0].split('-');
        let formatedDate = splited[1] + '/' + splited[0] + '/' + splited[2];
        let finalDateString = formatedDate + ' ';
        const getYear = new Date(finalDateString).getFullYear();
        const getMonth = new Date(finalDateString).getMonth();

        if (!chartMapData.has(getYear)) {
          let arr: number[] = Array(12).fill(0);
          arr[getMonth] = Math.floor(Number(i.orderedvalue));
          chartMapData.set(getYear, arr);
        } else {
          let oldData = chartMapData.get(getYear); // month i mapData --> fn
          oldData.splice(
            getMonth,
            1,
            oldData[getMonth] + Math.floor(Number(i.orderedvalue))
          );
        }
      }
      if (!chartMapData.has(previousYear)) {
        let arr: number[] = Array(12).fill(0);
        chartMapData.set(previousYear, arr);
      }
      chartMapData.forEach((item, key) => {
        if (key === selectedYear || key === previousYear) {
          productSales.push({
            name: key == selectedYear ? 'This year' : 'Last Year',
            color: key == selectedYear ? '#419FC7' : '#E46A11',
            data: item,
          });
        }
      });
    }
    //this month
    if (formValues?.filterData == '3') {
      chartCategories = monthChartCategories;
      let monthFilter = chartFilterData.filter((item: any) => {
        let sodate = item.sodate;
        let splited = sodate.split(' ')[0].split('-');
        let formatedDate = splited[2] + '-' + splited[1] + '-' + splited[0];
        return (
          new Date(formatedDate).getMonth() === new Date().getMonth() ||
          new Date(formatedDate).getMonth() === new Date().getMonth() - 1
        );
      });
      if (monthFilter) {
        for (let i of monthFilter) {
          let sodate = i.sodate;
          let splited = sodate.split(' ')[0].split('-');
          let formatedDate = splited[1] + '/' + splited[0] + '/' + splited[2];
          let finalDateString = formatedDate + ' ';
          const getDate = new Date(finalDateString).getDate();
          const getMonth = new Date(finalDateString).getMonth();
          if (!chartMapData.has(getMonth)) {
            let arr: number[] = Array(31).fill(0);
            arr[getDate] = Math.floor(Number(i.orderedvalue));
            chartMapData.set(getMonth, arr);
          } else {
            let oldData = chartMapData.get(getMonth);
            oldData.splice(
              getDate,
              1,
              oldData[getDate] + Math.floor(Number(i.orderedvalue))
            );
          }
        }
      }
      if (!chartMapData.has(ThisMonth)) {
        let arr: number[] = Array(31).fill(0);
        chartMapData.set(ThisMonth, arr);
      }

      if (!chartMapData.has(LastMonth)) {
        let arr: number[] = Array(31).fill(0);
        chartMapData.set(LastMonth, arr);
      }
      chartMapData.forEach((item, key) => {
        if (key === ThisMonth || key === LastMonth) {
          productSales.push({
            name: key == ThisMonth ? 'This Month' : 'Last Month',
            color: key == ThisMonth ? '#419FC7' : '#E46A11',
            data: item,
          });
        }
      });
    }
    //this week
    if (formValues?.filterData == '2') {
      chartCategories = WeekChartCategories;
      let WeekFilter = chartFilterData.filter((item: any) => {
        let sodate = item.sodate;
        let splited = sodate.split(' ')[0].split('-');
        let formatedDate = splited[2] + '-' + splited[1] + '-' + splited[0];
        return (
          new Date(formatedDate).toISOString() >=
            firstOfLastWeek.toISOString() &&
          new Date(formatedDate).toISOString() <= saturday.toISOString()
        );
      });
      for (let i of WeekFilter) {
        let sodate = i.sodate;
        let splited = sodate.split(' ')[0].split('-');
        let formatedDate = splited[1] + '/' + splited[0] + '/' + splited[2];
        let finalDateString = formatedDate + ' ';
        const getDay = new Date(finalDateString).getDay();
        const lastWeek =
          new Date(formatedDate).toISOString() >=
            firstOfLastWeek.toISOString() &&
          new Date(formatedDate).toISOString() <= endOfLastWeek.toISOString();
        if (lastWeek) {
          if (!chartMapData.has('Last Week')) {
            let arr: number[] = Array(7).fill(0);
            arr[getDay] = Math.floor(Number(i.orderedvalue));
            chartMapData.set('Last Week', arr);
          } else {
            let oldData = chartMapData.get('Last Week');
            oldData.splice(
              getDay,
              1,
              oldData[getDay] + Math.floor(Number(i.orderedvalue))
            );
          }
        } else {
          if (!chartMapData.has('This Week')) {
            let arr: number[] = Array(7).fill(0);
            arr[getDay] = Math.floor(Number(i.orderedvalue));
            chartMapData.set('This Week', arr);
          } else {
            let oldData = chartMapData.get('This Week');
            oldData.splice(
              getDay,
              1,
              oldData[getDay] + Math.floor(Number(i.orderedvalue))
            );
          }
        }
      }
      if (!chartMapData.has('Last Week')) {
        let arr: number[] = Array(7).fill(0);
        chartMapData.set('Last Week', arr);
      }
      if (!chartMapData.has('This Week')) {
        let arr: number[] = Array(7).fill(0);
        chartMapData.set('This Week', arr);
      }

      chartMapData.forEach((item, key) => {
        // if (key === ThisMonth || key === LastMonth) {
        productSales.push({
          name: key,
          color: key == 'This Week' ? '#419FC7' : '#E46A11',
          data: item,
        });
        // }
      });
    }
    //today
    if (formValues?.filterData == '1') {
      chartCategories = TodayChartCategories;
      let dayFilter = chartFilterData.filter((item: any) => {
        let sodate = item.sodate;
        let splited = sodate.split(' ')[0].split('-');
        let formatedDate = splited[2] + '-' + splited[1] + '-' + splited[0];
        let date = new Date();
        date.setDate(date.getDate() - 1);

        return (
          new Date(formatedDate).toISOString().split('T')[0] ===
            new Date().toISOString().split('T')[0] ||
          new Date(formatedDate).toISOString().split('T')[0] ===
            new Date(date).toISOString().split('T')[0]
        );
      });
      for (let i of dayFilter) {
        let sodate = i.sodate;
        let splited = sodate.split(' ')[0].split('-');
        let formatedDate = splited[1] + '/' + splited[0] + '/' + splited[2];
        let splitHour: any = sodate.split(' ')[1].split('-');
        let getHour = splitHour.join().split(' ')[0].split('.');

        const Today =
          new Date(formatedDate).toISOString().split('T')[0] ===
          new Date().toISOString().split('T')[0];

        if (Today) {
          if (!chartMapData.has('Today')) {
            let arr: number[] = Array(24).fill(0);
            arr[getHour[0]] = Math.floor(Number(i.orderedvalue));
            chartMapData.set('Today', arr);
          } else {
            let oldData = chartMapData.get('Today');
            oldData.splice(
              getHour[0],
              1,
              oldData[getHour[0]] + Math.floor(Number(i.orderedvalue))
            );
          }
        } else {
          if (!chartMapData.has('Yesterday')) {
            let arr: number[] = Array(24).fill(0);
            arr[getHour[0]] = Math.floor(Number(i.orderedvalue));
            chartMapData.set('Yesterday', arr);
          } else {
            let oldData = chartMapData.get('Yesterday');
            oldData.splice(
              getHour[0],
              1,
              oldData[getHour[0]] + Math.floor(Number(i.orderedvalue))
            );
          }
        }
      }
      if (!chartMapData.has('Yesterday')) {
        let arr: number[] = Array(24).fill(0);
        chartMapData.set('Yesterday', arr);
      }
      if (!chartMapData.has('Today')) {
        let arr: number[] = Array(24).fill(0);
        chartMapData.set('Today', arr);
      }

      chartMapData.forEach((item, key) => {
        productSales.push({
          name: key,
          color: key === 'Today' ? '#419FC7' : '#E46A11',
          data: item,
        });
      });
    }

    if (productSales.length) {
      seriesData = productSales;
    }

    this.chartOptions = {
      year: selectedYear,
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
        colors: ['#419FC7', '#E46A11'],
        curve: 'smooth',
      },
      xaxis: {
        categories: chartCategories,
      },
    };
  }

  loadData() {
    this.salesapi.getPendingSOListAll().subscribe((res: any[]) => {
      if (res.length) {
        const newMap = new Map();
        res
          .map((item: any) => {
            return {
              name: item.vendorname,
              id: item.vendorcode,
            };
          })
          .forEach((item: VendorDropDown) => newMap.set(item.id, item));
        this.vendorDropDownData = [...newMap.values()];
        // console.log(this.vendorDropDownData, 'vendor drop downdata');
        // this.form.get('vendorcode')?.setValue('56');
        this.salesOrderData = res;
        this.getFilterData(this.form.value, res);
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
              dataKey: 'sono',
            },
            {
              header: 'Data & Time',
              dataKey: 'sodate',
            },
            {
              header: 'Quantity',
              dataKey: 'sono',
            },
            {
              header: 'Price',
              dataKey: 'sono',
            },
            {
              header: 'Status',
              dataKey: 'sono',
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
