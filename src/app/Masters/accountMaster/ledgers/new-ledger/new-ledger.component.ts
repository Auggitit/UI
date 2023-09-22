import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { map, Observable, startWith } from 'rxjs';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import Swal from 'sweetalert2';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ApiService } from 'src/app/services/api.service';

export interface lg {
  groupcode: string;
  groupname: string;
}

@Component({
  selector: 'app-new-ledger',
  templateUrl: './new-ledger.component.html',
  styleUrls: ['./new-ledger.component.scss'],
})
export class NewLedgerComponent implements OnInit {
  saveAsOptions: dropDownData[] = exportOptions;
  isCreateLedger: boolean = true;
  loading: boolean = false;
  countryData: any;
  stateData: any;
  ledgercode: any;
  parentTextBox = new FormControl('');
  filteredParent!: Observable<lg[]>;
  parent: lg[] = [];
  showbank = false;
  uniqueID: any;
  ledgerForm!: FormGroup;
  ledgerUnder: any;
  ledgerUnderName: any;
  accholdername: any;
  accno: any;
  ifsccode: any;
  swiftcode: any;
  bankname: any;
  branchname: any;
  address: any;
  country: any;
  state: any;
  statecode: any;
  pincode: any;
  gstin: any;
  oldid: any;
  countryDropDownData: dropDownData[] = [];
  stateDropDownData: dropDownData[] = [];

  private _filterParent(value: string): lg[] {
    const filterValue = value.toLowerCase();
    return this.parent.filter((prod) =>
      prod.groupname.toLowerCase().includes(filterValue)
    );
  }

  constructor(
    public api: ApiService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setValidations();
    this.loadParentGroup();
    this.loadStatedata();
    this.loadCountrydata();
    this.oldid = this.activatedRoute.snapshot.paramMap.get('id');

    this.ledgerForm.get('cstate')?.valueChanges.subscribe((value) => {
      let stateCode = this.stateDropDownData.filter(
        (item) => item.id === value
      );
      this.ledgerForm.get('cStateName')?.setValue(stateCode[0].name);
    });

    if (this.activatedRoute.snapshot.queryParams['type'] == 'edit') {
      this.isCreateLedger = false;

      this.api.get_LedgerDataWithID(this.oldid).subscribe((res) => {
        this.ledgerForm.patchValue({
          cledgerName: res.companyDisplayName,
          cledgerUnder: res.groupCode,
          cgstin: res.gstNo,
          ccountry: res.bilingCountry,
          cstate: res.stateCode,
          cStateName: res.stateName,
          caddress: res.bilingAddress,
          cpincode: res.bilingPincode,
        });
        this.ledgercode = res.ledgerCode;
        this.accholdername = res.accholdername;
        this.accno = res.accNo;
        this.ifsccode = res.ifscCode;
        this.swiftcode = res.swiftCode;
        this.bankname = res.bankName;
        this.branchname = res.branch;

        var val = res.groupName.substring(0, 4).toLowerCase();
        if (val == 'bank') this.showbank = true;
        else this.showbank = false;
      });
    }
  }

  onClickButton(): void {
    this.router.navigateByUrl('ledger-list');
  }

  onClickAddButton(): void {
    this.router.navigateByUrl('create-ledger');
  }

  setValidations(): void {
    this.ledgerForm = this.fb.group({
      cledgerName: ['', Validators.required],
      cledgerUnder: ['', Validators.required],
      caccholdername: ['', Validators.nullValidator],
      caccno: ['', Validators.nullValidator],
      cifsccode: ['', Validators.nullValidator],
      cswiftcode: ['', Validators.nullValidator],
      cbankname: ['', Validators.nullValidator],
      cbranchname: ['', Validators.nullValidator],
      caddress: ['', Validators.nullValidator],
      cstate: ['', Validators.nullValidator],
      cStateName: ['', Validators.nullValidator],
      ccountry: ['', Validators.nullValidator],
      cpincode: ['', Validators.nullValidator],
      cgstin: ['', Validators.nullValidator],
    });
  }

  loadParentGroup() {
    this.api.get_LedgerGroup().subscribe((res) => {
      this.parent = res;
      this.filteredParent = this.parentTextBox.valueChanges.pipe(
        startWith(''),
        map((prod) => (prod ? this._filterParent(prod) : this.parent.slice()))
      );
    });
  }

  //loadFunctions
  loadCountrydata() {
    this.api.get_CountryData().subscribe((res) => {
      this.countryData = res;
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

  loadStatedata() {
    this.api.get_StateData().subscribe((res) => {
      this.stateData = res;
      const newMap = new Map();
      res
        .map((item: any) => {
          return {
            name: item.statename,
            id: item.stetecode,
          };
        })
        .forEach((item: any) => newMap.set(item.id, item));
      this.stateDropDownData = [...newMap.values()];
    });
  }

  parentChanged(event: any, r: any) {
    if (event.isUserInput == true) {
      this.ledgerUnderName = r.groupname;
      this.ledgerUnder = r.groupcode;
      var val = r.groupname.substring(0, 4).toLowerCase();
      if (val == 'bank') this.showbank = true;
      else this.showbank = false;
    }
  }

  async getMaxCode() {
    return new Promise((resolve) => {
      this.api.getMaxLedgerID().subscribe((res) => {
        this.ledgercode = res;
        resolve({ action: 'success' });
      });
    });
  }

  validate() {
    if (this.ledgerUnder != undefined) {
      if (this.ledgerUnder.length == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Select Account Group!',
          text: 'Please Select Account Group!',
        });
        return false;
      } else {
        return true;
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Select Account Group!',
        text: 'Please Select Account Group!',
      });
      return false;
    }
  }

  submit() {
    var res = this.validate();
    if (res == true) {
      if (this.ledgerForm.valid) {
        this.loading = true;
        setTimeout(() => {
          this.getMaxCode().then((res) => {
            if (this.isCreateLedger) {
              this.save();
            } else if (!this.isCreateLedger) {
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
  }

  save() {
    if (this.address == null || this.address == undefined) {
      this.address = '';
    }
    if (this.country == null || this.country == undefined) {
      this.country = '';
    }
    if (this.statecode == null || this.statecode == undefined) {
      this.statecode = '';
    }
    if (this.pincode == null || this.pincode == undefined) {
      this.pincode = '';
    }
    if (this.gstin == null || this.gstin == undefined) {
      this.gstin = '';
    }
    if (this.state == null || this.state == undefined) {
      this.state = '';
    }
    if (this.statecode == null || this.statecode == undefined) {
      this.statecode = '';
    }
    if (this.accholdername == null || this.accholdername == undefined) {
      this.accholdername = '';
    }
    if (this.accno == null || this.accno == undefined) {
      this.accno = '';
    }
    if (this.ifsccode == null || this.ifsccode == undefined) {
      this.ifsccode = '';
    }
    if (this.swiftcode == null || this.swiftcode == undefined) {
      this.swiftcode = '';
    }
    if (this.bankname == null || this.bankname == undefined) {
      this.bankname = '';
    }
    if (this.branchname == null || this.branchname == undefined) {
      this.branchname = '';
    }

    this.uniqueID = Guid.create();
    var postdata = {
      id: this.uniqueID.value,
      type: '',
      salutation: '',
      firstName: '',
      lastName: '',
      ledgerCode: this.ledgercode,
      companyDisplayName: this.ledgerForm.value.cledgerName,
      companyMobileNo: '',
      companyEmailID: '',
      companyWebSite: '',
      groupName: this.ledgerUnderName,
      groupCode: this.ledgerUnder.toString(),
      contactPersonName: '',
      contactPhone: '',
      designation: '',
      department: '',
      mobileNo: '',
      emailID: '',
      currency: '',
      balancetoPay: '',
      balancetoCollect: '',
      paaymentTerm: '',
      creditLimit: '',
      bankDetails: '',
      stateName: this.ledgerForm.value.cStateName,
      stateCode: this.ledgerForm.value.cstate,
      gstTreatment: '',
      gstNo: this.ledgerForm.value.cgstin,
      panNo: '',
      cinNo: '',
      bilingAddress: this.ledgerForm.value.caddress,
      bilingCountry: this.ledgerForm.value.ccountry,
      bilingCity: '',
      bilingState: this.ledgerForm.value.cstate,
      bilingPincode: this.ledgerForm.value.cpincode,
      bilingPhone: '',
      deliveryAddress: '',
      deliveryCountry: '',
      deliveryCity: '',
      deliveryState: '',
      deliveryPinCode: '',
      deliveryPhone: '',
      notes: '',
      rCreatedDateTime: new Date(),
      rStatus: 'A',
      accholdername: this.accholdername,
      accNo: this.accno,
      ifscCode: this.ifsccode,
      swiftCode: this.swiftcode,
      bankName: this.bankname,
      branch: this.branchname,
    };
    this.api.Inser_LedgerData(postdata).subscribe({
      next: (data) => {
        let dialogRef = this.dialog.open(SuccessmsgComponent, {
          data: 'Successfully Saved!',
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.clearAll();
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
    if (this.address == null || this.address == undefined) {
      this.address = '';
    }
    if (this.country == null || this.country == undefined) {
      this.country = '';
    }
    if (this.statecode == null || this.statecode == undefined) {
      this.statecode = '';
    }
    if (this.pincode == null || this.pincode == undefined) {
      this.pincode = '';
    }
    if (this.gstin == null || this.gstin == undefined) {
      this.gstin = '';
    }
    if (this.state == null || this.state == undefined) {
      this.state = '';
    }
    if (this.statecode == null || this.statecode == undefined) {
      this.statecode = '';
    }
    if (this.accholdername == null || this.accholdername == undefined) {
      this.accholdername = '';
    }
    if (this.accno == null || this.accno == undefined) {
      this.accno = '';
    }
    if (this.ifsccode == null || this.ifsccode == undefined) {
      this.ifsccode = '';
    }
    if (this.swiftcode == null || this.swiftcode == undefined) {
      this.swiftcode = '';
    }
    if (this.bankname == null || this.bankname == undefined) {
      this.bankname = '';
    }
    if (this.branchname == null || this.branchname == undefined) {
      this.branchname = '';
    }

    //this.uniqueID = Guid.create();
    var postdata = {
      id: this.oldid,
      type: '',
      salutation: '',
      firstName: '',
      lastName: '',
      ledgerCode: this.ledgercode,
      companyDisplayName: this.ledgerForm.value.cledgerName,
      companyMobileNo: '',
      companyEmailID: '',
      companyWebSite: '',
      groupName: this.ledgerForm.value.cledgerUnder,
      groupCode: this.ledgerForm.value.cledgerUnder.toString(),
      contactPersonName: '',
      contactPhone: '',
      designation: '',
      department: '',
      mobileNo: '',
      emailID: '',
      currency: '',
      balancetoPay: '',
      balancetoCollect: '',
      paaymentTerm: '',
      creditLimit: '',
      bankDetails: '',
      stateName: this.ledgerForm.value.cStateName,
      stateCode: this.ledgerForm.value.cstate,
      gstTreatment: '',
      gstNo: this.ledgerForm.value.cgstin,
      panNo: '',
      cinNo: '',
      bilingAddress: this.ledgerForm.value.caddress,
      bilingCountry: this.ledgerForm.value.ccountry,
      bilingCity: '',
      bilingState: this.ledgerForm.value.cstate,
      bilingPincode: this.ledgerForm.value.cpincode,
      bilingPhone: '',
      deliveryAddress: '',
      deliveryCountry: '',
      deliveryCity: '',
      deliveryState: '',
      deliveryPinCode: '',
      deliveryPhone: '',
      notes: '',
      rCreatedDateTime: new Date(),
      rStatus: 'A',
      accholdername: this.accholdername,
      accNo: this.accno,
      ifscCode: this.ifsccode,
      swiftCode: this.swiftcode,
      bankName: this.bankname,
      branch: this.branchname,
    };

    this.api.Update_LedgerData(this.oldid, postdata).subscribe({
      next: (data) => {
        this.loading = false;
        let dialogRef = this.dialog.open(SuccessmsgComponent, {
          data: 'Ledger Successfully Updated',
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.clearAll();
          this.loading = false;
          this.router.navigateByUrl('ledger-list');
        });
      },
      error: (err) => {
        alert('Some Error Occured');
        this.loading = false;
      },
    });
  }

  clearAll() {
    this.ledgercode = '';
    this.ledgerUnderName = '';
    this.ledgerUnder = '';
    this.accholdername = '';
    this.accno = '';
    this.ifsccode = '';
    this.swiftcode = '';
    this.bankname = '';
    this.branchname = '';
    this.ledgerForm.reset();
    this.setValidations();
  }

  gotoList() {
    this.router.navigateByUrl('ledgerlist');
  }
}
