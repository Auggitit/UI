import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-stock-item-list',
  templateUrl: './stock-item-list.component.html',
  styleUrls: ['./stock-item-list.component.scss'],
})
export class StockItemListComponent implements OnInit {
  pageCount: number = 10;
  filteredData: any[] = [];
  paginationIndex: number = 0;
  selectAllCheckbox!: FormControlName;
  stockItemForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  searchCustomer: any;
  tableHeaderAlignValue: string='left';

  columns: any[] = [
    {
      title: 'Item Name',
      sortable: 0,
      name: 'itemname',
      needToShow: true,
    },
    { title: 'Item SKU', sortable: 0, name: 'itemsku', needToShow: true },
    {
      title: 'HSN/SAC',
      sortable: 0,
      name: 'itemhsn',
      needToShow: true,
    },
    {
      title: 'Item Group',
      sortable: 0,
      name: 'groupname',
      needToShow: true,
    },
    {
      title: 'Item Category',
      sortable: 0,
      name: 'catname',
      needToShow: true,
    },
    {
      title: 'Item UOM',
      sortable: 0,
      name: 'uomname',
      needToShow: true,
    },
    {
      title: 'GST',
      sortable: 0,
      name: 'gst',
      needToShow: true,
    },
    {
      title: 'CESS',
      sortable: 0,
      name: 'vat',
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
    this.stockItemForm = this.fb.group({
      selectAllCheckbox: [{ isSelected: false }],
      SelectSaveOptions: [exportOptions[0].id],
      searchValues: [''],
      columnFilter: [
        {
          title: 'Item Name',
          sortable: 0,
          name: 'itemname',
          needToShow: true,
        },
        { title: 'Item SKU', sortable: 0, name: 'itemsku', needToShow: true },
        {
          title: 'HSN/SAC',
          sortable: 0,
          name: 'itemhsn',
          needToShow: true,
        },
        {
          title: 'Item Group',
          sortable: 0,
          name: 'groupname',
          needToShow: true,
        },
        {
          title: 'Item Category',
          sortable: 0,
          name: 'catname',
          needToShow: true,
        },
        {
          title: 'Item UOM',
          sortable: 0,
          name: 'uomname',
          needToShow: true,
        },
        {
          title: 'GST',
          sortable: 0,
          name: 'gst',
          needToShow: true,
        },
        {
          title: 'CESS',
          sortable: 0,
          name: 'vat',
          needToShow: true,
        },
        { title: 'Action', sortable: 0, name: '', needToShow: true },
      ],
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.stockItemForm.valueChanges.subscribe((values) =>
      this.loadData(values)
    );
  }

  onClickButton(): void {
    this.router.navigateByUrl('stock-item-create');
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
    if (formValues.searchValues.length > 0) {
      let vendorTemp = [];
      vendorTemp.push(
        serverData.filter((i: any) =>
          i.itemname
            .toLowerCase()
            .includes(formValues.searchValues.toLowerCase())
        )
      );
      this.filteredData = vendorTemp;
    }
  }

  loadData(formValues?: any) {
    this.api.get_ItemData().subscribe((res) => {
      let data = new MatTableDataSource(JSON.parse(res)).filteredData;
      // this.vendorData = res;
      // this.filteredVendorData = res;
      // this.svd = res[0];
      // this.selectedID = this.svd.id;
      // console.log(this.vendorData);
      console.log(res, data, '...........response');
      this.getFilterData(formValues, data);
    });
  }
}
