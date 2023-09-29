import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-group-create',
  templateUrl: './stock-group-create.component.html',
  styleUrls: ['./stock-group-create.component.scss'],
})
export class StockGroupCreateComponent implements OnInit {
  @ViewChild('ename') ename: ElementRef | undefined;
  @ViewChild('eunder') eunder: MatSelect | undefined;
  @ViewChild('esave') esave: ElementRef | undefined;

  groupForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  groupDropDownData: dropDownData[] = [];

  uniqueID: any;
  groupcode: any;
  groupname: any;
  groupundername: any;
  groupundercode: any;
  groupData: any;
  loading: boolean = false;

  selectedID: any;
  displayedColumns: string[] = ['GROUP_NAME', 'ACTIONS'];
  dataSource!: MatTableDataSource<any>;
  savedData: any;
  isCreateStockGroup: boolean = true;
  oldid: any;

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) { }

  //Validators
  setValidations() {
    this.groupForm = this.fb.group({
      cgroupname: ['', Validators.required],
      cgroupunder: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.ename?.nativeElement.focus();
  }
  ngOnInit(): void {
    this.setValidations();
    this.getMaxCode();
    this.loaddata();

    this.oldid = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.activatedRoute.snapshot.queryParams['type'] == 'edit') {
      this.isCreateStockGroup = false;

      this.api.get_GroupDataWithID(this.oldid).subscribe((res) => {
        this.groupForm.patchValue({
          cgroupname: res.groupname,
          cgroupunder: res.groupunder,
        });
        this.groupcode = res.groupcode;
      });
    }
  }

  onClickButton(): void {
    this.router.navigateByUrl('stock-group-list');
  }

  onClickAddButton(): void {
    this.router.navigateByUrl('stock-group-create');
  }

  loaddata() {
    this.api.get_GroupData().subscribe((res) => {
      this.groupData = res;
      const newMap = new Map();
      res.map((item: any) => {
        return {
          name: item.groupname,
          id: item.groupcode,
        };
      })
        .forEach((item: any) => newMap.set(item.id, item));
      this.groupDropDownData = [...newMap.values()];
    });
  }
  async getMaxCode() {
    return new Promise((resolve) => {
      this.api.get_GroupMaxID().subscribe((res) => {
        this.groupcode = res;
        resolve({ action: 'success' });
      });
    });
  }

  submit() {
    if (this.groupForm.valid) {
      this.loading = true;
      setTimeout(() => {
        this.getMaxCode().then((res) => {
          if (this.isCreateStockGroup) {
            this.save();
          } else if (!this.isCreateStockGroup) {
            this.update();
          }
        });
      }, 400);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Fill Mandatory Fields',
        text: 'Plese fill all mandatory fields',
      });
    }
  }

  save() {
    this.uniqueID = Guid.create();
    var postData = {
      id: this.uniqueID.value,
      groupcode: this.groupcode,
      groupname: this.groupForm.value.cgroupname,
      groupunder: this.groupForm.value.cgroupunder,
      rCreatedDateTime: new Date(),
      rStatus: 'A',
    };
    this.api.Inser_GroupData(postData).subscribe({
      next:
        (data) => {
          let dialogRef = this.dialog.open(SuccessmsgComponent, {
            data: 'Stock Group Successfully Saved!',
          });
          dialogRef.afterClosed().subscribe((result) => {
            this.clear();
            this.loading = false;
          });
        },
      error: (err) => {
        alert('Some Error Occured');
        this.loading = false;
      },
    });
  }

  update() {
    var postdata = {
      id: this.oldid,
      groupcode: this.groupcode,
      groupname: this.groupForm.value.cgroupname,
      groupunder: this.groupForm.value.cgroupunder,
      rCreatedDateTime: new Date(),
      rStatus: 'A',
    };

    this.api.Update_GroupData(this.oldid, postdata).subscribe({
      next: (data) => {
        this.loading = false;
        let dialogRef = this.dialog.open(SuccessmsgComponent, {
          data: 'Stock Group Successfully Updated',
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.clear();
          this.loading = false;
          this.router.navigateByUrl('stock-item-list');
        });
      },
      error: (err) => {
        alert('Some Error Occured');
        this.loading = false;
      },
    });
  }

  clear() {
    this.groupname = '';
    this.groupundercode = '';
    this.selectedID = undefined;
    this.loading = false;
    this.groupForm.reset();
    this.setValidations();
    this.ename?.nativeElement.focus();
  }

  //Enter Key Events (Focus)
  catNameEnter(event: any) {
    if (this.groupForm.controls['cgroupname'].status != 'INVALID') {
      if (typeof this.groupname != 'undefined' && this.groupname) {
        {
          this.eunder?.focus();
        }
      }
    }
  }
  catUnderEnter(event: any) {
    if (typeof this.groupundercode != 'undefined' && this.groupundercode) {
      {
        this.esave?.nativeElement.focus();
      }
    }
  }

  //Dropdown Events
  changeGroup(event: MatSelectChange) {
    this.groupundercode = event.value;
    console.log(event.value);
  }

  //Filter
  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }
}
