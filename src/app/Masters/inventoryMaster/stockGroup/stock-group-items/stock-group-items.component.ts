import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-stock-group-items',
  templateUrl: './stock-group-items.component.html',
  styleUrls: ['./stock-group-items.component.scss'],
})
export class StockGroupItemsComponent implements OnInit {
  pageCount: number = 10;
  filteredData: any[] = [];
  paginationIndex: number = 0;
  selectAllCheckbox!: FormControlName;
  stockGroupForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  searchGroup: any;
  tableHeaderAlignValue: string='left';

  columns: any[] = [
    {
      title: 'Group Name',
      sortable: 0,
      name: 'groupname',
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
    this.stockGroupForm = this.fb.group({
      selectAllCheckbox: [{ isSelected: false }],
      SelectSaveOptions: [exportOptions[0].id],
      searchValues: [''],
      columnFilter: [
        {
          title: 'Group Name',
          sortable: 0,
          name: 'groupname',
          needToShow: true,
        },

        { title: 'Action', sortable: 0, name: '', needToShow: true },
      ],
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.stockGroupForm.valueChanges.subscribe((values) =>
      this.loadData(values)
    );
  }

  onClickButton(): void {
    this.router.navigateByUrl('stock-group-create');
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
          i.groupname
            .toLowerCase()
            .includes(formValues.searchValues.toLowerCase())
        )
      );
      this.filteredData = vendorTemp;
    }
  }
  loadData(formValues?: any) {
    this.api.get_GroupData().subscribe((res) => {
      // this.vendorData = res;
      // this.filteredVendorData = res;
      // this.svd = res[0];
      // this.selectedID = this.svd.id;
      // console.log(this.vendorData);
      console.log(res, '...........response');
      this.getFilterData(formValues, res);
    });
  }
}
