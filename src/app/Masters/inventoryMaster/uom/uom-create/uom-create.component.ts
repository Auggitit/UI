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
  selector: 'app-uom-create',
  templateUrl: './uom-create.component.html',
  styleUrls: ['./uom-create.component.scss'],
})
export class UomCreateComponent implements OnInit {
  loading: boolean = false;

  //Set Element Ref
  @ViewChild('ename') ename: ElementRef | undefined;
  @ViewChild('esave') esave: ElementRef | undefined;
  uomForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;

  uniqueID: any;
  code: any;
  name: any;
  digit: any;

  selectedID: any;
  displayedColumns: string[] = ['UOM_NAME', 'NO_OF', 'ACTIONS'];
  dataSource!: MatTableDataSource<any>;
  savedData: any;
  isCreateUOM: boolean = true;
  uomcode: any;
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
    this.uomForm = this.fb.group({
      cname: ['', Validators.required],
      cdigit: ['', Validators.required],
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
      this.isCreateUOM = false;

      this.api.get_UOMDataWithID(this.oldid).subscribe((res) => {
        this.uomForm.patchValue({
          cname: res.uomname,
          cdigit: res.digits,
        });
        this.uomcode = res.uomcode;
      });
    }
  }

  onClickButton(): void {
    this.router.navigateByUrl('uom-list');
  }

  onClickAddButton(): void {
    this.router.navigateByUrl('uom-create');
  }
  //Load Functions
  loaddata() {
    this.api.get_UOMData().subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.savedData = res;
      this.dataSource.filterPredicate = function (record, filter) {
        return record.uomname.toLocaleLowerCase() == filter.toLocaleLowerCase();
      };
    });
  }
  async getMaxCode() {
    return new Promise((resolve) => {
      this.api.get_UOMMaxID().subscribe((res) => {
        this.code = res;
        resolve({ action: 'success' });
      });
    });
  }

  submit() {
    if (this.uomForm.valid) {
      this.loading = true;
      setTimeout(() => {
        this.getMaxCode().then((res) => {
          if (this.isCreateUOM) {
            this.save();
          } else if (!this.isCreateUOM) {
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
      uomcode: this.uomcode,
      uomname: this.uomForm.value.cname,
      digits: this.uomForm.value.cdigit,
      rCreatedDateTime: new Date(),
      rStatus: 'A',
    };
    this.api.Inser_UOMData(postData).subscribe({
      next:
        (data) => {
          let dialogRef = this.dialog.open(SuccessmsgComponent, {
            data: 'UOM Successfully Saved!',
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
      uomcode: this.uomcode,
      uomname: this.uomForm.value.cname,
      digits: this.uomForm.value.cdigit,
      rCreatedDateTime: new Date(),
      rStatus: 'A',
    };

    this.api.Update_UOMData(this.oldid, postdata).subscribe({
      next: (data) => {
        this.loading = true;
        let dialogRef = this.dialog.open(SuccessmsgComponent, {
          data: 'UOM Successfully Updated',
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.clear();
          this.loading = false;
          this.router.navigateByUrl('uom-list');
        });
      },
      error: (err) => {
        alert('Some Error Occured');
        this.loading = false;
      },
    });
  }

  clear() {
    this.name = '';
    this.code = '';
    this.loading = false;
    this.selectedID = undefined;
    this.uomForm.reset();
    this.setValidations();
  }

  //Enter Key Events (Focus)
  NameEnter(event: any) {
    if (this.uomForm.controls['cname'].status != 'INVALID') {
      if (typeof this.name != 'undefined' && this.name) {
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
