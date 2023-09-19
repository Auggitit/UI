import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
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

@Component({
  selector: 'app-country-master-list',
  templateUrl: './country-master-list.component.html',
  styleUrls: ['./country-master-list.component.scss'],
})
export class CountryMasterListComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  pageCount: number = 10;
  filteredData: any[] = [];
  paginationIndex: number = 0;
  selectAllCheckbox!: FormControlName;
  CountryForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;

  columns: any[] = [
    {
      title: 'COUNTRY_NAME',
      sortable: 0,
      name: 'countryname',
      needToShow: true,
    },
    {
      title: 'CURRENCY_NAME',
      sortable: 0,
      name: 'currencyname',
      needToShow: true,
    },
    {
      title: 'CURRENCY_SHORT_NAME',
      sortable: 0,
      name: 'currencyshortname',
      needToShow: true,
    },
    {
      title: 'CURRENCY_SYMBOL',
      sortable: 0,
      name: 'currencysymbol',
      needToShow: true,
    },
    { title: 'Action', sortable: 0, name: '', needToShow: true },
  ];
  selectAll = { isSelected: false };

  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.CountryForm = this.fb.group({
      selectAllCheckbox: [{ isSelected: false }],
      SelectSaveOptions: [exportOptions[0].id],
      searchValues: [''],
      columnFilter: [
        {
          title: 'COUNTRY_NAME',
          sortable: 0,
          name: 'countryname',
          needToShow: true,
        },
        {
          title: 'CURRENCY_NAME',
          sortable: 0,
          name: 'currencyname',
          needToShow: true,
        },
        {
          title: 'CURRENCY_SHORT_NAME',
          sortable: 0,
          name: 'currencyshortname',
          needToShow: true,
        },
        {
          title: 'CURRENCY_SYMBOL',
          sortable: 0,
          name: 'currencysymbol',
          needToShow: true,
        },
        { title: 'Action', sortable: 0, name: '', needToShow: true },
      ],
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.CountryForm.valueChanges.subscribe((values) => this.loadData(values));
  }

  onClickButton(): void {
    this.router.navigateByUrl('country-master-create');
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
      newArr[rowIndex].push(data);
      rowCount++;
    }

    this.filteredData = newArr;
    console.log(this.filteredData, 'filrteeeeeeee');

    if (formValues?.searchValues.length > 0) {
      let vendorTemp = [];
      vendorTemp.push(
        serverData.filter((i: any) =>
          i.countryname
            .toLowerCase()
            .includes(formValues.searchValues.toLowerCase())
        )
      );
      this.filteredData = vendorTemp;
    }
  }

  loadData(formValues?: any) {
    this.api.get_CountryData().subscribe((res) => {
      console.log(res, '...........response');
      this.getFilterData(formValues, res);
    });
  }

  downloadAsPDF() {
    if (this.CountryForm.value.SelectSaveOptions === 0) {
      let topValue = 0;
      var data = this.contentToSave.nativeElement;

      html2canvas(data, { scale: 2 }).then(() => {
        let pdf = new jsPDF('p', 'pt', 'a4');

        let tableData = this.filteredData
          .flatMap((item) => item)
          .map((item) => item);
        console.log(tableData, 'tabledata');
        pdf.setLineWidth(2);
        pdf.text('Country', 240, (topValue += 50));
        pdf.setFontSize(12);

        autoTable(pdf, {
          body: tableData,
          columns: [
            {
              header: 'COUNTRY_NAME',
              dataKey: 'countryname',
            },
            {
              header: 'CURRENCY_NAME',
              dataKey: 'currencyname',
            },
            {
              header: 'CURRENCY_SHORT_NAME',
              dataKey: 'currencyshortname',
            },
            {
              header: 'CURRENCY_SYMBOL',
              dataKey: 'currencysymbol',
            },
          ],
          startY: (topValue += 30),
          theme: 'striped',
        });
        pdf.save('Country.pdf');
      });
    } else {
      //Code for Excel Format Download
      /* var blob = new Blob([html],{type: 'data:application/vnd.ms-excel' });
      var u = URL.createObjectURL(blob);
      window.open(u); */

      let element = document.getElementById('countryTable')!;

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      wb.Props = {
        Title: 'Country List',
      };
      var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([['']]);
      var wsCols = [
        { wch: 7 },
        { wch: 15 },
        { wch: 45 },
        { wch: 45 },
        { wch: 45 },
      ];
      ws['!cols'] = wsCols;
      XLSX.utils.sheet_add_aoa(ws, [['Country Summary']], { origin: 'E1' });
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            'So.No',
            'COUNTRY_NAME',
            'CURRENCY_NAME',
            'CURRENCY_SHORT_NAME',
            'CURRENCY_SYMBOL',
          ],
        ],
        { origin: 'A3' }
      );
      XLSX.utils.sheet_add_dom(ws, element, { origin: 'A5' });
      XLSX.utils.book_append_sheet(wb, ws, 'Country Summary');
      XLSX.writeFile(wb, 'Country Report.xlsx');
    }
  }
}
