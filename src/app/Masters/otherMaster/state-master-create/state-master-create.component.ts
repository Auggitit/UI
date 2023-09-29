import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ApiService } from '../../../services/api.service';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import Swal from 'sweetalert2';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';

@Component({
  selector: 'app-state-master-create',
  templateUrl: './state-master-create.component.html',
  styleUrls: ['./state-master-create.component.scss'],
})
export class StateMasterCreateComponent implements OnInit {
  saveAsOptions: dropDownData[] = exportOptions;
  oldid: any;
  loading: boolean = false;
  stateForm!: FormGroup;
  isCreateState: boolean = true;
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
  displayedColumns: string[] = [
    'COUNTRY',
    'STATE_NAME',
    'STATE_CODE',
    'ACTIONS',
  ];
  dataSource: any[] = [];
  countryData: any;
  selectedID: any;
  selectedCountry: any;
  countryDropDownData: dropDownData[] = [];

  changeCountry(event: MatSelectChange) {
    this.selectedCountry = event.value;
    console.log(this.selectedCountry);
  }

  ngOnInit(): void {
    console.log(this.selectedID);
    this.setValidations();
    this.loaddata();
    this.loadCountrydata();

    this.stateForm.get('cCountry')?.valueChanges.subscribe((value) => {
      let countryCode = this.countryDropDownData.filter(
        (item) => item.id === value
      );
      console.log("----inside init",countryCode)
      this.stateForm.get('cCountry')?.setValue(countryCode[0].name);
    });

    this.oldid = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.activatedRoute.snapshot.queryParams['type'] == 'edit') {
      this.isCreateState = false;

      this.api.get_StateDataWithID(this.oldid).subscribe((res) => {
        console.log('------', res);
        this.stateForm.patchValue({
          cCountry: res.country,
          sname: res.statename,
          scode: res.stetecode,
        });
        this.selectedCountry=res.country
/*         this.cCountry = res.countryname;
        this.sname = res.currencyname;
        this.scode = res.currencyshortname; */
      });
    }
  }

  onClickButton(): void {
    this.router.navigateByUrl('state-master-list');
  }

  setValidations() {
    this.stateForm = this.fb.group({
      cCountry: ['', Validators.required],
      sname: ['', Validators.required],
      scode: ['', Validators.required],
    });
  }

  loadCountrydata() {
    this.api.get_CountryData().subscribe((res) => {
      this.countryData = res;
      console.log("country data res",res)
      const newMap = new Map();
      res
        .map((item: any) => {
          return {
            name: item.countryname,
            id: item.countryname,
          };
        })
        .forEach((item: any) => newMap.set(item.id, item));
      this.countryDropDownData = [...newMap.values()];
    });
  }

  loaddata() {
    this.api.get_StateData().subscribe((res) => {
      this.dataSource = res;
      console.log(res);
    });
  }

  submit() {
    setTimeout(() => {
      if (this.stateForm.valid) {
        this.loading = true;
        this.uniqueID = Guid.create();
        var postdata = {
          id: this.uniqueID.value,
          country: this.stateForm.value.cCountry,
          stetecode: this.stateForm.value.scode,
          statename: this.stateForm.value.sname,
          rCreatedDateTime: new Date(),
          rStatus: 'A',
        };
        console.log(postdata);
        this.api.Inser_StateData(postdata).subscribe(
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



  restore(rowdata: any) {
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: 'Do you confirm the Restoration of this Country data?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.api.Delete_StateData(rowdata.id).subscribe(
          (data) => {
            let dialogRef = this.dialog.open(SuccessmsgComponent, {
              //width: '350px',
              data: 'Successfully Restored!',
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

  delete(rowdata: any) {
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: 'Do you confirm the deletion of this Country data?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.api.Delete_StateData(rowdata.id).subscribe(
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
  update(){
    setTimeout(() => {
      if (this.stateForm.valid) {
        this.loading = true;
        var postdata = {
          id: this.oldid,
          country: this.stateForm.value.cCountry,
          statename: this.stateForm.value.sname,
          stetecode: this.stateForm.value.scode,
          rCreatedDateTime: new Date(),
          rStatus: 'A',
        };
        console.log('update postdata', postdata);
        this.api.Update_StateData(this.oldid, postdata).subscribe(
          (data) => {
            let dialogRef = this.dialog.open(SuccessmsgComponent, {
              //width: '350px',
              data: 'Country Successfully Updated!',
            });
            dialogRef.afterClosed().subscribe((result) => {
              this.clear();
              //this.loaddata();
              this.loading = false;
              this.router.navigateByUrl('state-master-list');
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
  edit(rowdata: any) {
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: 'Do you Modify data?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(rowdata);
        this.selectedID = rowdata.id;
        this.selectedCountry = rowdata.country;
        this.code = rowdata.stetecode;
        this.name = rowdata.statename;
      }
    });
  }

  clear() {
    this.selectedID = undefined;
    this.code = '';
    this.name = '';
    this.stateForm.reset();
  }
}
