import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { CrnoteService } from 'src/app/services/credit.service';
import { GstdataService } from 'src/app/services/gstdata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-creditnotelist',
  templateUrl: './creditnotelist.component.html',
  styleUrls: ['./creditnotelist.component.scss'],
})
export class CreditnotelistComponent implements OnInit {
  constructor(
    public api: CrnoteService,
    crnapi: CrnoteService,
    public router: Router,
    public dialog: MatDialog,
    public gstdataapi: GstdataService
  ) {}

  podata: any;

  ngOnInit(): void {
    this.loaddata();
  }

  loaddata() {
    this.api.getCRNListAll().subscribe((res) => {
      console.log(res);
      this.podata = res;
    });
  }

  createNew() {
    this.router.navigateByUrl('cr');
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
        this.router.navigateByUrl('crupdate/' + encodeURIComponent(data.vchno));
      }
    });
  }

  _branch: any = '001';
  _fy: any = '001';
  _company: any = '001';
  _fyname: any = '23-24';
  vchtype: any = 'Credit Note';

  deletepo(data: any) {
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: 'Do you Delete data?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(data);
        this.api.Delete_Sales(data.vchno).subscribe((res) => {
          this.api.Delete_SalesDetails(data.vchno).subscribe((res) => {
            this.api.Delete_Accounts(data.vchno).subscribe((res) => {
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
                    text: 'CN ' + data.pono + ' Deleted Successfully',
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
