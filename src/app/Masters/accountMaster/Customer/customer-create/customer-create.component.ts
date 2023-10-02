import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss'],
})
export class CustomerCreateComponent implements OnInit {
  isCreateCustomer: boolean = true;
  loading: boolean = false;
  customerForm!: FormGroup;
  saveAsOptions: dropDownData[] = exportOptions;
  ledgercode: any;
  uniqueID: any;
  oldId: any;

  salutationData = [
    { name: 'Mr.', id: 'Mr.' },
    { name: 'Ms.', id: 'Ms.' },
    { name: 'Miss.', id: 'Miss.' },
    { name: 'Dr.', id: 'Dr.' },
  ];

  regTypeData = [
    {
      name: 'Registred Business - Regular',
      id: 'Registred Business - Regular',
    },
    {
      name: 'Registred Business - Composition',
      id: 'Registred Business - Composition',
    },
    { name: 'Unregistred Business', id: 'Unregistred Business' },
    { name: 'Overseas Business', id: 'Overseas Business' },
    { name: 'Deemed Export', id: 'Deemed Export' },
  ];
  countryDropDownData: dropDownData[] = [];
  stateDropDownData: dropDownData[] = [];
  currencyDropDownData: dropDownData[] = [];

  constructor(
    public api: ApiService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}

  setValidations(): void {
    this.customerForm = this.fb.group({
      ctype: [''],
      csalutation: [''],
      cfirstName: ['', Validators.required],
      clastName: [''],
      cdisplayName: ['', Validators.required],
      cmobile: ['', Validators.required],
      cemail: [
        '',
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/),
      ],
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
      cStateName: [''],
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
      ccpEmail: [
        '',
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/),
      ],
      cremarks: [''],
    });
  }

  ngOnInit(): void {
    this.setValidations();
    this.loadCountrydata();
    this.loadStatedata();

    this.oldId = this.activatedRoute.snapshot.paramMap.get('id');

    this.customerForm.get('cstate')?.valueChanges.subscribe((value) => {
      let stateCode = this.stateDropDownData.filter(
        (item) => item.id === value
      );
      this.customerForm.get('cStateName')?.setValue(stateCode[0].name);
    });

    if (this.activatedRoute.snapshot.queryParams['type'] == 'edit') {
      this.isCreateCustomer = false;
      {
        this.api.get_LedgerDataWithID(this.oldId).subscribe((res) => {
          console.log('Previous', res);
          this.customerForm.patchValue({
            ctype: res.type,
            csalutation: res.salutation,
            cfirstName: res.firstName,
            clastName: res.lastName,
            cdisplayName: res.companyDisplayName,
            cmobile: res.companyMobileNo,
            cemail: res.companyEmailID,
            cwebsite: res.companyWebSite,
            ccurrency: res.currency,
            cbalanceToPay: res.balancetoPay,
            cbalanceToColl: res.balancetoCollect,
            cpaymentTerm: res.paaymentTerm,
            ccreditLimit: res.creditLimit,
            cbankDetails: res.bankDetails,
            cgstTreatment: res.gstTreatment,
            cgstNo: res.gstNo,
            cstate: res.stateCode,
            cpanNo: res.panNo,
            ccinNo: res.cinNo,
            cbAddress: res.bilingAddress,
            cbCountry: res.bilingCountry,
            cbCity: res.bilingCity,
            cbState: res.bilingState,
            cbPincode: res.bilingPincode,
            cbPhone: res.bilingPhone,
            cdAddress: res.deliveryAddress,
            cdCountry: res.deliveryCountry,
            cdCity: res.deliveryCity,
            cdState: res.deliveryState,
            cdPincode: res.deliveryPinCode,
            cdPhone: res.deliveryPhone,
            ccpName: res.contactPersonName,
            ccpPhone: res.contactPhone,
            ccpDesignation: res.designation,
            ccpDepartment: res.department,
            ccpMobile: res.mobileNo,
            ccpEmail: res.emailID,
            cremarks: res.notes,
          });
        });
      }
    }
  }

  onClickButton(): void {
    this.router.navigateByUrl('customer-list');
  }

  loadCountrydata() {
    this.api.get_CountryData().subscribe((res) => {
      console.log(res, 'reeeeeeeeee');
      let countryData = res.length
        ? res.map((item: any) => {
            return {
              name: item.countryname,
              id: item.countryname,
            };
          })
        : [];
      let currencyData = res.length
        ? res.map((item: any) => {
            return {
              name: item.currencyname,
              id: item.currencyname,
            };
          })
        : [];
      this.countryDropDownData = countryData;
      this.currencyDropDownData = currencyData;
    });
  }

  loadStatedata() {
    this.api.get_StateData().subscribe((res) => {
      let stateData = res.length
        ? res.map((item: any) => {
            return {
              name: item.statename,
              id: item.stetecode,
            };
          })
        : [];
      this.stateDropDownData = stateData;
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
    console.log(this.customerForm.value, '-------11111------');
    if (this.customerForm.valid) {
      this.loading = true;
      setTimeout(() => {
        this.getMaxCode().then((res) => {
          if (this.isCreateCustomer) {
            this.save();
          } else if (!this.isCreateCustomer) {
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
    const formValue = this.customerForm.value;
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
      groupCode: 'LG0032',
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
      stateName: formValue.cStateName,
      stateCode: formValue.cstate,
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
          this.router.navigateByUrl('customer-list');
        });
      },
      error: (err) => {
        alert('Some Error Occured');
        this.loading = false;
      },
    });
  }

  update() {
    const formValue = this.customerForm.value;
    var postdata = {
      id: this.oldId,
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
      groupCode: 'LG0032',
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
      stateName: formValue.cStateName,
      stateCode: formValue.cstate,
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

    this.api.Update_LedgerData(this.oldId, postdata).subscribe({
      next: (data) => {
        this.loading = false;
        let dialogRef = this.dialog.open(SuccessmsgComponent, {
          data: 'Successfully Updated!',
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.router.navigateByUrl('/customer-list');
        });
      },
      error: (err) => {
        console.log(err);
        alert('Some Error Occured');
      },
    });
  }

  gotoList() {
    this.router.navigateByUrl('customer-list');
  }

  clearAll() {
    this.customerForm.reset();
  }
}
