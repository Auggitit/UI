import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { DrnoteService } from 'src/app/services/debit.service';
import { GstdataService } from 'src/app/services/gstdata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-debitnotelist',
  templateUrl: './debitnotelist.component.html',
  styleUrls: ['./debitnotelist.component.scss'],
})
export class DebitnotelistComponent implements OnInit {
  constructor(
    public drapi: DrnoteService,
    public router: Router,
    public dialog: MatDialog,
    public gstdataapi: GstdataService
  ) {}

  podata: any;

  ngOnInit(): void {
    this.loaddata();
  }

  loaddata() {
    this.drapi.getGRNListAll().subscribe((res) => {
      console.log(res);
      this.podata = res;
    });
  }

  createNew() {
    this.router.navigateByUrl('dr');
  }

  editpo(data: any) {
    var msg = '';
    if (data.pending == 0) {
      msg = 'PO is Completed! Do you want to Edit';
    } else {
      msg = 'Do you Modify data?';
    }
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: msg,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigateByUrl('drupdate/' + encodeURIComponent(data.vchno));
      }
    });
  }

  _branch: any = '001';
  _fy: any = '001';
  _company: any = '001';
  _fyname: any = '23-24';
  vchtype: any = 'Debit Note';

  deletepo(data: any) {
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: 'Do you Delete data?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(data);
        this.drapi.Delete_DRN(data.grnno).subscribe((res) => {
          this.drapi.Delete_DRNDetails(data.grnno).subscribe((res) => {
            this.drapi.Delete_Accounts(data.grnno).subscribe((res) => {
              this.gstdataapi
                .Delete_GstData(
                  data.vchno,
                  this.vchtype,
                  this._branch,
                  this._fy
                )
                .subscribe((res) => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'DN ' + data.pono + ' Deleted Successfully',
                  });
                  this.loaddata();
                });
            });
          });
        });
      }
    });
  }

  convertbill(data: any) {}
}
