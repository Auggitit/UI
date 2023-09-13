import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { GrnService } from 'src/app/services/grn.service';
import { GstdataService } from 'src/app/services/gstdata.service';
// import { GstdataService } from 'src/app/services/gstdata.service';
import { PoService } from 'src/app/services/po.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grnlist',
  templateUrl: './grnlist.component.html',
  styleUrls: ['./grnlist.component.scss'],
})
export class GrnlistComponent implements OnInit {
  constructor(
    public grnapi: GrnService,
    public poapi: PoService,
    public router: Router,
    private viewportScroller: ViewportScroller,
    public dialog: MatDialog,
    public gstdataapi: GstdataService
  ) {}

  podata: any;

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.loaddata();
  }

  loaddata() {
    this.grnapi.getGRNListAll().subscribe((res) => {
      this.podata = res;
      console.log(res);
    });
  }

  createNewGrn() {
    this.router.navigateByUrl('grn');
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  editpo(data: any) {
    var msg = '';
    if (data.pending == 0) {
      msg = 'GRN is Completed! Do you want to Edit';
    } else {
      msg = 'Do you Modify data?';
    }
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: msg,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // const grnid = '1';
        // const fy = '23-24';

        // var navigationExtras: NavigationExtras = {
        //   queryParams: { secureValue: data.grnno },
        // };
        // this.router.navigate(['grnupdate'], navigationExtras);
        this.router.navigateByUrl(
          'grnupdate/' + encodeURIComponent(data.grnno)
        );
        // var desiredValue = uuidv4();
        // var encodedValue = encodeURIComponent(data.grnno );
        // var url = 'grnupdate/' + desiredValue;
        // this.router.navigateByUrl(url, { state: { originalValue: encodedValue } });

        this.viewportScroller.scrollToPosition([0, 0]);
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
        this.grnapi
          .Delete_GRNDetails(data.grnno, data.vtype, data.branch, data.fy)
          .subscribe((res) => {
            this.grnapi
              .Delete_GRN(data.grnno, data.vtype, data.branch, data.fy)
              .subscribe((res) => {
                this.grnapi
                  .Delete_CusdefFields(
                    data.grnno,
                    data.vtype,
                    data.branch,
                    data.fy
                  )
                  .subscribe((res) => {
                    this.grnapi
                      .deteleAllLedger(
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
                            this.grnapi
                              .Delete_overdue(
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
