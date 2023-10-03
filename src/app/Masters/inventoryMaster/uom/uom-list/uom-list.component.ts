import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmationDialogBoxComponent } from 'src/app/shared/components/confirmation-dialog-box/confirmation-dialog-box.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-uom-list',
  templateUrl: './uom-list.component.html',
  styleUrls: ['./uom-list.component.scss'],
})
export class UomListComponent implements OnInit {
  pageCount: number = 10;
  filteredData: any[] = [];
  paginationIndex: number = 0;
  selectAllCheckbox!: FormControlName;
  uomForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  searchstockgroup: any;
  tableHeaderAlignValue: string = 'left';
  loading: boolean = true;

  columns: any[] = [
    {
      title: 'UOM_NAME',
      sortable: 0,
      name: 'uomname',
      needToShow: true,
    },
    {
      title: 'NO OF DIGITS',
      sortable: 0,
      name: 'digits',
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
    this.uomForm = this.fb.group({
      selectAllCheckbox: [{ isSelected: false }],
      SelectSaveOptions: [exportOptions[0].id],
      searchValues: [''],
      columnFilter: [
        {
          title: 'UOM_NAME',
          sortable: 0,
          name: 'uomname',
          needToShow: true,
        },
        {
          title: 'NO OF DIGITS',
          sortable: 0,
          name: 'digits',
          needToShow: true,
        },
        { title: 'Action', sortable: 0, name: '', needToShow: true },
      ],
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.uomForm.valueChanges.subscribe((values) => this.loadData(values));
  }

  onClickButton(): void {
    this.router.navigateByUrl('uom-create');
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
          i.uomname
            .toLowerCase()
            .includes(formValues.searchValues.toLowerCase())
        )
      );
      this.filteredData = vendorTemp;
    }
  }

  loadData(formValues?: any) {
    this.api.get_UOMData().subscribe((res) => {
      // this.vendorData = res;
      // this.filteredVendorData = res;
      // this.svd = res[0];
      // this.selectedID = this.svd.id;
      // console.log(this.vendorData);
      console.log(res, '...........response');
      this.getFilterData(formValues, res);
    });
  }

  onClickEdit(data: any): void {
    var msg = '';
    if (data.pending == 0) {
      msg = 'UOM is Completed! It is not possible to  Edit';
    } else {
      msg = 'Do you Modify data?';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogBoxComponent, {
      data: {
        iconToDisplay: 'EditData',
        contentText: msg,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.router.navigate(['uom-create/' + data.id], {
          queryParams: { type: 'edit' },
        });
      }
    });
  }

  onClickDelete(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogBoxComponent, {
      data: {
        iconToDisplay: 'DeleteFile',
        contentText: 'Do You Want To Delete Data ?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.api
          .Delete_UOMData(data.id)
          .subscribe((res) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'UOM Deleted Successfully',
            });
            this.loading = false;
            this.loadData(data);
          });
      }
    });
  }

  onClickRestore(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogBoxComponent, {
      data: {
        iconToDisplay: 'RestoreFile',
        contentText: 'Do You Want To Restore Data ?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.api
          .Delete_UOMData(data.id)
          .subscribe((res) => {
            Swal.fire({
              icon: 'success',
              title: 'Restored!',
              text: 'UOM Restored Successfully',
            });
            this.loading = false;
            this.loadData(data);
          });
      }
    });
  }
}
