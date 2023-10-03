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
  selector: 'app-LedgerGroup-create',
  templateUrl: './LedgerGroup-create.component.html',
  styleUrls: ['./LedgerGroup-create.component.scss'],
})
export class LedgerGroupCreateComponent implements OnInit {
  loading: boolean = false;

  //Set Element Ref
  @ViewChild('ename') ename: ElementRef | undefined;
  @ViewChild('esave') esave: ElementRef | undefined;
  LedgerGroupForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;

  groupDropDownData: dropDownData[] = [];
  uniqueID: any;
  groupcode: any;
  groupname: any;
  groupundername: any;
  groupundercode: any;
  groupData: any;

  selectedID: any;
  displayedColumns: string[] = ['GROUP_NAME', 'ACTIONS'];
  dataSource!: MatTableDataSource<any>;
  savedData: any;
  isCreateLedgerGroup: boolean = true;
  LedgerGroupcode: any;
  oldid: any;

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) { }

  //Validators
  setValidations() {
    this.LedgerGroupForm = this.fb.group({
      lgroupname: ['', Validators.required],
      lgroupunder: ['', Validators.required],
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
      this.isCreateLedgerGroup = false;

      this.api.get_LedgerGroupwithID(this.oldid).subscribe((res) => {
        this.LedgerGroupForm.patchValue({
          lgroupname: res.groupname,
          lgroupunder: res.groupunder,
        });
        this.LedgerGroupcode = res.groupcode;
      });
    }
  }

  async getMaxCode() {
    return new Promise((resolve) => {
      this.api.get_LedgerGroup_MaxID().subscribe((res) => {
        this.groupcode = res;
        resolve({ action: 'success' });
      });
    });
  }

  onClickButton(): void {
    this.router.navigateByUrl('LedgerGroup-list');
  }

  onClickAddButton(): void {
    this.router.navigateByUrl('LedgerGroup-create');
  }
  //Load Functions
  loaddata() {
    this.api.get_LedgerGroup().subscribe((res) => {
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

  submit() {
    if (this.LedgerGroupForm.valid) {
      this.loading = true;
      setTimeout(() => {
        this.getMaxCode().then((res) => {
          if (this.isCreateLedgerGroup) {
            this.save();
          } else if (!this.isCreateLedgerGroup) {
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
      groupname: this.LedgerGroupForm.value.lgroupname,
      groupunder: this.LedgerGroupForm.value.lgroupunder,
      rCreatedDateTime: new Date(),
      rStatus: 'A',
    };
    this.api.Inser_LedgerGroup(postData).subscribe({
      next:
        (data) => {
          let dialogRef = this.dialog.open(SuccessmsgComponent, {
            data: 'LedgerGroup Successfully Saved!',
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
      groupname: this.LedgerGroupForm.value.lgroupname,
      groupunder: this.LedgerGroupForm.value.lgroupunder,
      rCreatedDateTime: new Date(),
      rStatus: 'A',
    };

    this.api.Update_LedgerGroup(this.oldid, postdata).subscribe({
      next: (data) => {
        this.loading = true;
        let dialogRef = this.dialog.open(SuccessmsgComponent, {
          data: 'LedgerGroup Successfully Updated',
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.clear();
          this.loading = false;
          this.router.navigateByUrl('LedgerGroup-list');
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
    this.loading = false;
    this.selectedID = undefined;
    this.LedgerGroupForm.reset();
    this.setValidations();
    this.ename?.nativeElement.focus();
  }

  //Enter Key Events (Focus)
  NameEnter(event: any) {
    if (this.LedgerGroupForm.controls['lgroupname'].status != 'INVALID') {
      if (typeof this.groupname != 'undefined' && this.groupname) {
        {
          this.esave?.nativeElement?.focus();
        }
      }
    }
  }

  //Filter
  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }
}
