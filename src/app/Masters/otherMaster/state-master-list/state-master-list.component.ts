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
  selector: 'app-state-master-list',
  templateUrl: './state-master-list.component.html',
  styleUrls: ['./state-master-list.component.scss'],
})
export class StateMasterListComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  pageCount: number = 10;
  filteredData: any[] = [];
  paginationIndex: number = 0;
  selectAllCheckbox!: FormControlName;
  stateForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  tableHeaderAlignValue: string = 'left';

  columns: any[] = [
    {
      title: 'COUNTRY',
      sortable: 0,
      name: 'country',
      needToShow: true,
    },
    {
      title: 'STATE_NAME',
      sortable: 0,
      name: 'statename',
      needToShow: true,
    },
    {
      title: 'STATE_CODE',
      sortable: 0,
      name: 'stetecode',
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
    this.stateForm = this.fb.group({
      selectAllCheckbox: [{ isSelected: false }],
      SelectSaveOptions: [exportOptions[0].id],
      searchValues: [''],
      columnFilter: [
        {
          title: 'COUNTRY',
          sortable: 0,
          name: 'country',
          needToShow: true,
        },
        {
          title: 'STATE_NAME',
          sortable: 0,
          name: 'statename',
          needToShow: true,
        },
        {
          title: 'STATE_CODE',
          sortable: 0,
          name: 'stetecode',
          needToShow: true,
        },
        { title: 'Action', sortable: 0, name: '', needToShow: true },
      ],
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.stateForm.valueChanges.subscribe((values) => this.loadData(values));
  }

  onClickButton(): void {
    this.router.navigateByUrl('state-master-create');
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
          i.statename
            .toLowerCase()
            .includes(formValues.searchValues.toLowerCase())
        )
      );
      this.filteredData = vendorTemp;
    }
  }

  loadData(formValues?: any) {
    this.api.get_StateData().subscribe((res) => {
      console.log(res, '...........response');
      this.getFilterData(formValues, res);
    });
  }

  downloadAsPDF() {
    if (this.stateForm.value.SelectSaveOptions === 0) {
      let topValue = 0;
      var data = this.contentToSave.nativeElement;

      html2canvas(data, { scale: 2 }).then(() => {
        let pdf = new jsPDF('p', 'pt', 'a4');

        let tableData = this.filteredData
          .flatMap((item) => item)
          .map((item) => item);
        console.log(tableData, 'tabledata');
        pdf.setLineWidth(2);
        pdf.text('State', 240, (topValue += 50));
        pdf.setFontSize(12);

        autoTable(pdf, {
          body: tableData,
          columns: [
            {
              header: 'COUNTRY',
              dataKey: 'country',
            },
            {
              header: 'STATE_NAME',
              dataKey: 'statename',
            },
            {
              header: 'STATE_CODE',
              dataKey: 'stetecode',
            },
          ],
          startY: (topValue += 30),
          theme: 'striped',
        });
        pdf.save('State.pdf');
      });
    } else {
      //Code for Excel Format Download
      /* var blob = new Blob([html],{type: 'data:application/vnd.ms-excel' });
      var u = URL.createObjectURL(blob);
      window.open(u); */

      let element = document.getElementById('stateTable')!;

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      wb.Props = {
        Title: 'State List',
      };
      var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([['']]);
      var wsCols = [{ wch: 7 }, { wch: 15 }, { wch: 45 }, { wch: 45 }];
      ws['!cols'] = wsCols;
      XLSX.utils.sheet_add_aoa(ws, [['State Summary']], { origin: 'E1' });
      XLSX.utils.sheet_add_aoa(
        ws,
        [['So.No', 'COUNTRY', 'STATE_NAME', 'STATE_CODE']],
        { origin: 'A3' }
      );
      XLSX.utils.sheet_add_dom(ws, element, { origin: 'A5' });
      XLSX.utils.book_append_sheet(wb, ws, 'State Summary');
      XLSX.writeFile(wb, 'State Report.xlsx');
    }
  }
}
