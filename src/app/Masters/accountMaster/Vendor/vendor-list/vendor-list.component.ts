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
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss'],
})
export class VendorListComponent implements OnInit {
  @ViewChild('contentToSave', { static: false }) contentToSave!: ElementRef;
  pageCount: number = 10;
  filteredData: any[] = [];
  paginationIndex: number = 0;
  selectAllCheckbox!: FormControlName;
  vendorForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  searchVendor: any;
  tableHeaderAlignValue: string = 'left';

  columns: any[] = [
    {
      title: 'Ledger Name',
      sortable: 0,
      name: 'companyDisplayName',
      needToShow: true,
    },
    { title: 'Ledger Under', sortable: 0, name: 'sono', needToShow: true },
    {
      title: 'Ledger Address',
      sortable: 0,
      name: 'ordered',
      needToShow: true,
    },
    {
      title: 'Contact Person',
      sortable: 0,
      name: 'ordered',
      needToShow: true,
    },
    {
      title: 'M. No',
      sortable: 0,
      name: 'ordered',
      needToShow: true,
    },
    {
      title: 'Place of Supply',
      sortable: 0,
      name: 'ordered',
      needToShow: true,
    },
    {
      title: 'GSTIN No',
      sortable: 0,
      name: 'ordered',
      needToShow: true,
    },
    {
      title: 'Payment Terms',
      sortable: 0,
      name: 'ordered',
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
    this.vendorForm = this.fb.group({
      selectAllCheckbox: [{ isSelected: false }],
      SelectSaveOptions: [exportOptions[0].id],
      searchValues: [''],
      columnFilter: [
        {
          title: 'Ledger Name',
          sortable: 0,
          name: 'companyDisplayName',
          needToShow: true,
        },
        { title: 'Ledger Under', sortable: 0, name: 'sono', needToShow: true },
        {
          title: 'Ledger Address',
          sortable: 0,
          name: 'ordered',
          needToShow: true,
        },
        {
          title: 'Contact Person',
          sortable: 0,
          name: 'ordered',
          needToShow: true,
        },
        {
          title: 'M. No',
          sortable: 0,
          name: 'ordered',
          needToShow: true,
        },
        {
          title: 'Place of Supply',
          sortable: 0,
          name: 'ordered',
          needToShow: true,
        },
        {
          title: 'GSTIN No',
          sortable: 0,
          name: 'ordered',
          needToShow: true,
        },
        {
          title: 'Payment Terms',
          sortable: 0,
          name: 'ordered',
          needToShow: true,
        },
        { title: 'Action', sortable: 0, name: '', needToShow: true },
      ],
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.vendorForm.valueChanges.subscribe((values) => this.loadData(values));
  }

  onClickButton(): void {
    this.router.navigateByUrl('create-vendor');
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
          i.companyDisplayName
            .toLowerCase()
            .includes(formValues.searchValues.toLowerCase())
        )
      );
      this.filteredData = vendorTemp;
    }
  }

  loadData(formValues?: any) {
    this.api.getVendorsOnly().subscribe((res) => {
      console.log(res, '...........response');
      this.getFilterData(formValues, res);
    });
  }

  downloadAsPDF() {
    if (this.vendorForm.value.SelectSaveOptions === 0) {
      let topValue = 0;
      var data = this.contentToSave.nativeElement;

      html2canvas(data, { scale: 2 }).then(() => {
        let pdf = new jsPDF('p', 'pt', 'a4');

        let tableData = this.filteredData
          .flatMap((item) => item)
          .map((item) => item);
        console.log(tableData, 'tabledata');
        pdf.setLineWidth(2);
        pdf.text('Vendor', 240, (topValue += 50));
        pdf.setFontSize(12);

        autoTable(pdf, {
          body: tableData,
          columns: [
            {
              header: 'Ledger Name',
              dataKey: 'companyDisplayName',
            },
            {
              header: 'Ledger Under',
              dataKey: 'groupName',
            },
            {
              header: 'Ledger Address',
              dataKey: 'bilingAddress',
            },
            {
              header: 'Contact Person',
              dataKey: 'firstName',
            },
            {
              header: 'M. No',
              dataKey: 'mobileNo',
            },
            {
              header: 'Place of Supply',
              dataKey: 'stateName',
            },
            {
              header: 'GSTIN No',
              dataKey: 'gstNo',
            },
            {
              header: 'Payment Terms',
              dataKey: 'paaymentTerm',
            },
          ],
          startY: (topValue += 30),
          theme: 'striped',
        });
        pdf.save('Vendor.pdf');
      });
    } else {
      //Code for Excel Format Download
      /* var blob = new Blob([html],{type: 'data:application/vnd.ms-excel' });
      var u = URL.createObjectURL(blob);
      window.open(u); */

      let element = document.getElementById('vendorTable')!;

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      wb.Props = {
        Title: 'Vendor List',
      };
      var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([['']]);
      var wsCols = [
        { wch: 7 },
        { wch: 15 },
        { wch: 45 },
        { wch: 45 },
        { wch: 45 },
        { wch: 45 },
        { wch: 45 },
        { wch: 45 },
        { wch: 45 },
      ];
      ws['!cols'] = wsCols;
      XLSX.utils.sheet_add_aoa(ws, [['Vendor Summary']], { origin: 'E1' });
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            'So.No',
            'Ledger Name',
            'Ledger Under',
            'Ledger Address',
            'Contact Person',
            'M. No',
            'Place of Supply',
            'GSTIN No',
            'Payment Terms',
          ],
        ],
        { origin: 'A3' }
      );
      XLSX.utils.sheet_add_dom(ws, element, { origin: 'A5' });
      XLSX.utils.book_append_sheet(wb, ws, 'Vendor Summary');
      XLSX.writeFile(wb, 'Vendor Report.xlsx');
    }
  }
}
