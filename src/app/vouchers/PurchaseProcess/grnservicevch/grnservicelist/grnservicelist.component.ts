import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { PoService } from 'src/app/services/po.service';
import { GrnserviceService } from 'src/app/services/grnservice.service';
import Swal from 'sweetalert2';
import { GrnService } from 'src/app/services/grn.service';
import { GstdataService } from 'src/app/services/gstdata.service';
// import { GstdataService } from 'src/app/services/gstdata.service';

@Component({
  selector: 'app-grnservicelist',
  templateUrl: './grnservicelist.component.html',
  styleUrls: ['./grnservicelist.component.scss'],
})
export class GrnservicelistComponent implements OnInit {
  constructor(
    public grnapi: GrnserviceService,
    public grn: GrnService,
    public poapi: PoService,
    public router: Router,
    public dialog: MatDialog,
    public gstdataapi: GstdataService
  ) {}

  podata: any;

  ngOnInit(): void {
    this.loaddata();
  }

  loaddata() {
    this.grnapi.getGRNListAll().subscribe((res) => {
      this.podata = res;
    });
  }

  createNewGrn() {
    this.router.navigateByUrl('servicegrn');
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
        this.router.navigateByUrl(
          'servicegrnupdate/' + data.sgrnid + '/' + '23-24'
        );
      }
    });
  }

  deletepo(data: any) {
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: 'Do you Delete data?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // console.log(data);
        this.grnapi
          .Delete_GRNDetails(data.grnno, data.vtype, data.branch, data.fy)
          .subscribe((res) => {
            this.grnapi
              .Delete_CusdefFields(data.grnno, data.vtype, data.branch, data.fy)
              .subscribe((res) => {
                this.grnapi
                  .Delete_GRN(data.grnno, data.vtype, data.branch, data.fy)
                  .subscribe((res) => {
                    this.grnapi
                      .deteleAllLedger(
                        data.grnno,
                        data.vtype,
                        data.branch,
                        data.fy
                      )
                      .subscribe((res) => {
                        this.grnapi
                          .Delete_overdue(
                            data.grnno,
                            data.vtype,
                            data.branch,
                            data.fy
                          )
                          .subscribe((res) => {
                            this.gstdataapi
                              .Delete_GstData(
                                data.grnno,
                                data.vtype,
                                data.branch,
                                data.fy
                              )
                              .subscribe((res) => {
                                Swal.fire({
                                  icon: 'success',
                                  title: 'Deleted!',
                                  text: 'Voucher Deleted Successfully!',
                                });
                                this.loaddata();
                              });
                          });
                      });
                  });
              });
          });
      }
    });
  }

  convertbill(data: any) {}
}
