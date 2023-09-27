import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-stock-category-list',
  templateUrl: './stock-category-list.component.html',
  styleUrls: ['./stock-category-list.component.scss'],
})
export class StockCategoryListComponent implements OnInit {
  pageCount: number = 10;
  filteredData: any[] = [];
  paginationIndex: number = 0;
  selectAllCheckbox!: FormControlName;
  stockCategoryForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  searchCategory: any;
  tableHeaderAlignValue: string='left';

  columns: any[] = [
    {
      title: 'CATEGORY_NAME',
      sortable: 0,
      name: 'catname',
      needToShow: true,
    },

    { title: 'Action', sortable: 0, name: '', needToShow: true },
  ];
  selectAll = { isSelected: false };

  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.stockCategoryForm = this.fb.group({
      selectAllCheckbox: [{ isSelected: false }],
      SelectSaveOptions: [exportOptions[0].id],
      searchValues: [''],
      columnFilter: [
        {
          title: 'CATEGORY_NAME',
          sortable: 0,
          name: 'catname',
          needToShow: true,
        },

        { title: 'Action', sortable: 0, name: '', needToShow: true },
      ],
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.stockCategoryForm.valueChanges.subscribe((values) =>
      this.loadData(values)
    );
  }

  onClickButton(): void {
    this.router.navigateByUrl('stock-category-create');
  }

  onClickEdit(data: any): void {
    var msg = '';
    if (data.pending == 0) {
      msg = 'SO is Completed! It is not possible to  Edit';
    } else {
      msg = 'Do you Modify data?';
    }
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: 'Do you Modify data?',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.router.navigateByUrl('create-ledger/' + data.id);
        this.router.navigate(['stock-category-create/' + data.id], {
          queryParams: { type: 'edit' },
        });
      }
    });
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
          i.catname
            .toLowerCase()
            .includes(formValues.searchValues.toLowerCase())
        )
      );
      this.filteredData = vendorTemp;
    }
  }
  loadData(formValues?: any) {
    this.api.get_CategoryData().subscribe((res) => {
      console.log(res, '...........response');
      this.getFilterData(formValues, res);
    });
  }
}
