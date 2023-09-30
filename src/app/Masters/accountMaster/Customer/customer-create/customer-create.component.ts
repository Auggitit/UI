import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ApiService } from 'src/app/services/api.service';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss'],
})
export class CustomerCreateComponent implements OnInit {
  isCreateCustomer: boolean = false;
  loading: boolean = false;
  customerForm!: FormGroup;
  countryData: any;
  stateData: any;
  currencyData: any;
  saveAsOptions: dropDownData[] = exportOptions;
  countryDropDownData: dropDownData[] = [];
  stateDropDownData: dropDownData[] = [];
  currencyDropDownData: dropDownData[] = [];
  salutationData = [
    { name: 'Mr.', id: 1 },
    { name: 'V', id: 2 },
    { name: 'Ms.', id: 3 },
    { name: 'Miss.', id: 4 },
    { name: 'Dr.', id: 5 },
  ];

  constructor(
    public api: ApiService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setValidations();
    this.loadCountrydata();
    this.loadStatedata();
    this.loadCurrencydata();
  }

  onClickButton(): void {
    this.router.navigateByUrl('customer-list');
  }

  setValidations(): void {
    this.customerForm = this.fb.group({
      customerName: null,
      salutation: null,
      firstName: ['', Validators.required],
      lastName: null,
      mobile: ['', Validators.required],
      email: null,
      website: null,
      currency: null,
      gstState: ['', Validators.required],
      gstCurrency: null,
      gstGstinNo: null,
      gstPanNo: null,
      gstCinNo: null,
      payBalancePay: null,
      payBalanceCollect: null,
      payTerm: null,
      payCreditLimit: null,
      payBankDetails: null,
      communicationCountry: null,
      communicationState: null,
      communicationCity: null,
      communicationPhone: null,
      communicationAddress: null,
      communicationPincode: null,
      deliveryCountry: null,
      deliveryState: null,
      deliveryCity: null,
      deliveryPhone: null,
      deliveryAddress: null,
      deliveryPincode: null,
      contactName: null,
      contactDesignation: null,
      contactDepartment: null,
      contactMobile: null,
      contactEmail: null,
      remarks: null,
    });
  }

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

  loadCurrencydata(){
    this.api.get_CountryData().subscribe((res) => {
      console.log("res country data",res)
      this.currencyData = res;
      const newMap = new Map();
      res
        .map((item: any) => {
          return {
            name: item.currencyname,
            id: item.id,
          };
        })
        .forEach((item: any) => newMap.set(item.id, item));
      this.currencyDropDownData = [...newMap.values()];
    });
  }

  submit(){

  }

  clearAll(){

  }
}
