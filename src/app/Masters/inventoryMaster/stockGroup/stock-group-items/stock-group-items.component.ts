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
  tableHeaderAlignValue: string = 'left';
  loading: boolean = true;

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
    private router: Router,
    public dialog: MatDialog
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
      this.getFilterData(formValues, res);
    });
  }

  onClickEdit(data: any) {
    var msg = '';
    if (data.pending == 0) {
      msg = 'Stock Group is Completed! It is not possible to  Edit';
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
        this.router.navigate(['stock-group-create/' + data.id], {
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
          .Delete_GroupData(data.id)
          .subscribe((res) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Stock Group Deleted Successfully',
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
          .Delete_GroupData(data.id)
          .subscribe((res) => {
            Swal.fire({
              icon: 'success',
              title: 'Restored!',
              text: 'Stock Group Restored Successfully',
            });
            this.loading = false;
            this.loadData(data);
          });
      }
    });
  }
}
