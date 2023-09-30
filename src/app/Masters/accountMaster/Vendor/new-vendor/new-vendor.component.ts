import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ApiService } from 'src/app/services/api.service';
// import { ApiService } from '../../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-vendor',
  templateUrl: './new-vendor.component.html',
  styleUrls: ['./new-vendor.component.scss'],
})
export class NewVendorComponent implements OnInit {
  saveAsOptions: dropDownData[] = exportOptions;
  loading: boolean = false;
  isCreateVendor: boolean = true;
  ledgercode: any;
  uniqueID: any;
  vendorForm!: FormGroup;
  salutationData = [
    { name: 'Mr.', id: 1 },
    { name: 'V', id: 2 },
    { name: 'Ms.', id: 3 },
    { name: 'Miss.', id: 4 },
    { name: 'Dr.', id: 5 },
  ];
  countryDropDownData: dropDownData[] = [];
  stateDropDownData: dropDownData[] = [];

  constructor(
    public api: ApiService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router
  ) {}

  setValidations(): void {
    this.vendorForm = this.fb.group({
      ctype: [''],
      csalutation: [''],
      cfirstName: ['', Validators.required],
      clastName: [''],
      cdisplayName: ['', Validators.required],
      cmobile: ['', Validators.required],
      cemail: [''],
      cwebsite: [''],
      ccurrency: [''],
      cbalanceToPay: [''],
      cbalanceToColl: [''],
      cpaymentTerm: [''],
      ccreditLimit: [''],
      cbankDetails: [''],
      cgstTreatment: [''],
      cgstNo: [''],
      cstate: ['', Validators.required],
      cstatecode: [''],
      cpanNo: [''],
      ccinNo: [''],
      cbAddress: [''],
      cbCountry: [''],
      cbCity: [''],
      cbState: [''],
      cbPincode: [''],
      cbPhone: [''],
      cdAddress: [''],
      cdCountry: [''],
      cdCity: [''],
      cdState: [''],
      cdPincode: [''],
      cdPhone: [''],
      ccpName: [''],
      ccpPhone: [''],
      ccpDesignation: [''],
      ccpDepartment: [''],
      ccpMobile: [''],
      ccpEmail: [''],
      cremarks: [''],
    });
  }

  ngOnInit(): void {
    this.setValidations();
    this.loadCountrydata();
    this.loadStatedata();

    this.vendorForm.get('cstatecode')?.valueChanges.subscribe((value) => {
      let stateCode = this.stateDropDownData.filter(
        (item) => item.id === value
      );
      this.vendorForm.get('cstate')?.setValue(stateCode[0].name);
    });
  }

  onClickButton(): void {
    this.router.navigateByUrl('vendor-list');
  }

  loadCountrydata() {
    this.api.get_CountryData().subscribe((res) => {
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

  async getMaxCode() {
    return new Promise((resolve) => {
      this.api.getMaxLedgerID().subscribe((res) => {
        this.ledgercode = res;
        resolve({ action: 'success' });
      });
    });
  }

  submit() {
    console.log(this.vendorForm.value, '-------11111------');
    if (this.vendorForm.valid) {
      this.loading = true;
      setTimeout(() => {
        this.getMaxCode().then((res) => {
          this.save();
        });
      }, 200);
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
    const formValue = this.vendorForm.value;
    var postdata = {
      id: this.uniqueID.value,
      type: formValue.ctype,
      salutation: formValue.csalutation,
      firstName: formValue.cfirstName,
      lastName: formValue.clastName,
      ledgerCode: this.ledgercode,
      companyDisplayName: formValue.cdisplayName,
      companyMobileNo: formValue.cmobile,
      companyEmailID: formValue.cemail,
      companyWebSite: formValue.cwebsite,
      groupName: 'SUNDRY CREDITOR',
      groupCode: 'LG0031',
      contactPersonName: formValue.ccpName,
      contactPhone: formValue.ccpPhone,
      designation: formValue.ccpDesignation,
      department: formValue.ccpDepartment,
      mobileNo: formValue.ccpPhone,
      emailID: formValue.ccpEmail,
      currency: formValue.ccurrency,
      balancetoPay: formValue.cbalanceToPay,
      balancetoCollect: formValue.cbalanceToColl,
      paaymentTerm: formValue.cpaymentTerm,
      creditLimit: formValue.ccreditLimit,
      bankDetails: formValue.cbankDetails,
      stateName: formValue.cstate,
      stateCode: formValue.cstatecode,
      gstTreatment: formValue.cgstTreatment,
      gstNo: formValue.cgstNo,
      panNo: formValue.cpanNo,
      cinNo: formValue.ccinNo,
      bilingAddress: formValue.cbAddress,
      bilingCountry: formValue.cbCountry,
      bilingCity: formValue.cbCity,
      bilingState: formValue.cbState,
      bilingPincode: formValue.cbPincode,
      bilingPhone: formValue.cbPhone,
      deliveryAddress: formValue.cdAddress,
      deliveryCountry: formValue.cdCountry,
      deliveryCity: formValue.cdCity,
      deliveryState: formValue.cdState,
      deliveryPinCode: formValue.cdPincode,
      deliveryPhone: formValue.cdPhone,
      notes: formValue.cremarks,
      rCreatedDateTime: new Date(),
      rStatus: 'A',
    };

    this.api.Inser_LedgerData(postdata).subscribe({
      next: (data) => {
        let dialogRef = this.dialog.open(SuccessmsgComponent, {
          data: 'Successfully Saved!',
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.clearAll();
          this.loading = false;
          this.router.navigateByUrl('vendor-list');
        });
      },
      error: (err) => {
        alert('Some Error Occured');
        this.loading = false;
      },
    });
  }

  gotoList() {
    this.router.navigateByUrl('vendorlist');
  }

  clearAll() {
    this.vendorForm.reset();
  }
}
