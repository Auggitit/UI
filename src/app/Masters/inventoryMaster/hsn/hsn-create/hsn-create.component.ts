import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ApiService } from 'src/app/services/api.service';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import Swal from 'sweetalert2';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';

@Component({
  selector: 'app-hsn-create',
  templateUrl: './hsn-create.component.html',
  styleUrls: ['./hsn-create.component.scss']
})
export class HsnCreateComponent implements OnInit {
  saveAsOptions: dropDownData[] = exportOptions;
  oldid: any;
  loading: boolean = false;
  hsnForm!: FormGroup;
  isCreateHsn: boolean = true;
  constructor(
    public api: ApiService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}
  uniqueID: any;
  code: any;
  name: any;
  dataSource: any[] = [];
  selectedID: any;

  ngOnInit(): void {
    console.log(this.selectedID);
    this.setValidations();

    this.oldid = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.activatedRoute.snapshot.queryParams['type'] == 'edit') {
      this.isCreateHsn = false;

      this.api.GetHsn_withId(this.oldid).subscribe((res) => {
        console.log('------', res);
        this.hsnForm.patchValue({
          gstValue: res.gst,
          hsnValue: res.hsn,
         
        });
      });
    }
  }


  onClickButton(): void {
    this.router.navigateByUrl('hsn-list');
  }

  setValidations() {
    this.hsnForm = this.fb.group({
      gstValue: ['', Validators.required],
      hsnValue: ['', Validators.required],
    });
  }

  submit() {
    setTimeout(() => {
      if (this.hsnForm.valid) {
        this.loading = true;
        this.uniqueID = Guid.create();
        var postdata = {
          id: this.uniqueID.value,
          hsn: this.hsnForm.value.hsnValue,
          gst: this.hsnForm.value.gstValue,
          rCreatedDateTime: new Date(),
          rStatus: 'A',
        };
        console.log(postdata);
        this.api.PostHsn(postdata).subscribe(
          (data) => {
            let dialogRef = this.dialog.open(SuccessmsgComponent, {
              //width: '350px',
              data: 'HSN Successfully Saved!',
            });
            dialogRef.afterClosed().subscribe((result) => {
              this.clear();
              this.loading = false;
            });
          },
          (err) => {
            console.log(err);
            alert('Some Error Occured');
          }
        );
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Fill Mandatory Fields',
          text: 'Plese fill all mandatory fields',
        });
      }
    }, 200);
  }




  update(){
    setTimeout(() => {
      if (this.hsnForm.valid) {
        this.loading = true;
        var postdata = {
          id: this.oldid,
          gst: this.hsnForm.value.gstValue,
          hsn: this.hsnForm.value.hsnValue,
          rCreatedDateTime: new Date(),
          rStatus: 'A',
        };
        console.log('update postdata', postdata);
        this.api.update_Hsn(this.oldid, postdata).subscribe(
          (data) => {
            let dialogRef = this.dialog.open(SuccessmsgComponent, {
              //width: '350px',
              data: 'HSN Successfully Updated!',
            });
            dialogRef.afterClosed().subscribe((result) => {
              this.clear();
              //this.loaddata();
              this.loading = false;
              this.router.navigateByUrl('hsn-list');
            });
          },
          (err) => {
            console.log(err);
            alert('Some Error Occured');
          }
        );
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Fill Mandatory Fields',
          text: 'Plese fill all mandatory fields',
        });
      }
    }, 200);
  }


  clear() {
    this.selectedID = undefined;
    this.hsnForm.reset();
  }
}
