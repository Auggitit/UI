import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ApiService } from '../../../services/api.service';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-country-master-create',
  templateUrl: './country-master-create.component.html',
  styleUrls: ['./country-master-create.component.scss'],
})
export class CountryMasterCreateComponent implements OnInit {
  loading: boolean = false;
  countryFormNew!: FormGroup;
  oldid: any;
  constructor(
    public api: ApiService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}
  uniqueID: any;
  selectedID: any;
  cname: any;
  curname: any;
  curshortname: any;
  cursymbol: any;
  dataSource: any[] = [];
  isCreateCountry: boolean = true;

  ngOnInit(): void {
    this.setValidations();
    this.loaddata();

    this.oldid = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.activatedRoute.snapshot.queryParams['type'] == 'edit') {
      this.isCreateCountry = false;

      this.api.get_CountryDataWithID(this.oldid).subscribe((res) => {
        console.log('------', res);
        this.countryFormNew.patchValue({
          ccname: res.countryname,
          ccurname: res.currencyname,
          ccursname: res.currencyshortname,
          ccursymbol: res.currencysymbol,
        });
        this.cname = res.countryname;
        this.curname = res.currencyname;
        this.curshortname = res.currencyshortname;
        this.cursymbol = res.currencysymbol;
      });
    }
  }

  setValidations() {
    this.countryFormNew = this.fb.group({
      ccname: ['', Validators.required],
      ccurname: ['', Validators.required],
      ccursname: ['', Validators.required],
      ccursymbol: ['', Validators.required],
    });
  }

  loaddata() {
    this.api.get_CountryData().subscribe((res) => {
      this.dataSource = res;
      console.log(res);
    });
  }
  //Working
  submit() {
    setTimeout(() => {
      if (this.countryFormNew.valid) {
        this.loading = true;
        this.uniqueID = Guid.create();
        var postdata = {
          id: this.uniqueID.value,
          countryname: this.countryFormNew.value.ccname,
          currencyname: this.countryFormNew.value.ccurname,
          currencyshortname: this.countryFormNew.value.ccursname,
          currencysymbol: this.countryFormNew.value.ccursymbol,
          rCreatedDateTime: new Date(),
          rStatus: 'A',
        };
        console.log(postdata);
        this.api.Inser_CountryData(postdata).subscribe(
          (data) => {
            let dialogRef = this.dialog.open(SuccessmsgComponent, {
              //width: '350px',
              data: 'Country Successfully Saved!',
            });
            dialogRef.afterClosed().subscribe((result) => {
              this.clear();
              this.loaddata();
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

  update() {
    setTimeout(() => {
      if (this.countryFormNew.valid) {
        this.loading = true;
        var postdata = {
          id: this.oldid,
          countryname: this.countryFormNew.value.ccname,
          currencyname: this.countryFormNew.value.ccurname,
          currencyshortname: this.countryFormNew.value.ccursname,
          currencysymbol: this.countryFormNew.value.ccursymbol,
          rCreatedDateTime: new Date(),
          rStatus: 'A',
        };
        console.log('update postdata', postdata);
        this.api.Update_CountryData(this.oldid, postdata).subscribe(
          (data) => {
            let dialogRef = this.dialog.open(SuccessmsgComponent, {
              //width: '350px',
              data: 'Country Successfully Updated!',
            });
            dialogRef.afterClosed().subscribe((result) => {
              this.clear();
              //this.loaddata();
              this.loading = false;
              this.router.navigateByUrl('country-master-list');
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

  onClickCountyListButton() {
    this.router.navigateByUrl('country-master-list');
  }

  delete(rowdata: any) {
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: 'Do you confirm the deletion of this Country data?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.api.Delete_CountryData(rowdata.id).subscribe(
          (data) => {
            let dialogRef = this.dialog.open(SuccessmsgComponent, {
              //width: '350px',
              data: 'Successfully Deleted!',
            });
            dialogRef.afterClosed().subscribe((result) => {
              this.clear();
              this.loaddata();
            });
          },
          (err) => {
            console.log(err);
            alert('Some Error Occured');
          }
        );
      }
    });
  }

  clear() {
    this.selectedID = undefined;
    this.cname = '';
    this.curname = '';
    this.cursymbol = '';
    this.countryFormNew.reset();
  }
}
