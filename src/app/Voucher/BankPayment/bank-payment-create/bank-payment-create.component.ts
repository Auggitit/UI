import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { dropDownData, exportOptions } from 'src/app/reports/stub/salesOrderStub';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-bank-payment-create',
  templateUrl: './bank-payment-create.component.html',
  styleUrls: ['./bank-payment-create.component.scss']
})
export class BankPaymentCreateComponent implements OnInit {

  bankPaymentForm!: FormGroup;
  vchdate: any;
  saveAsOptions: dropDownData[] = exportOptions;
  customerData: dropDownData[] = [];

  paymentTypeData: dropDownData[] = [
    { name: 'BILL BY BILL', id: 'BILL BY BILL' },
    { name: 'ON ACCOUNT', id: 'ON ACCOUNT' },
    { name: 'ADVANCE', id: 'ADVANCE' },
  ];

  paymentModeData: dropDownData[] = [
    { name: 'CHEQUE', id: 'CHEQUE' },
    { name: 'ONLINE', id: 'ONLINE' },
  ];


  constructor(
    public api: ApiService,
    private router: Router,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.setValidations();
    this.loadCustomers();
    this.vchdate = new Date();
  }

  setValidations() {
    this.bankPaymentForm = this.fb.group({
      cvoucherno: ['', [Validators.required]],
      cvchdate: ['', [Validators.required]],
      cpaymenttype: ['', [Validators.required]],
      ccustomercode: ['', [Validators.required]],
      caccountcode: ['', [Validators.required]],
      cpaymentmode: ['', [Validators.required]],
      cvoucheramount: ['', [Validators.required]],
      cremarks: ['', [Validators.required]],
    });
  }

  onClickButton(): void {
    this.router.navigateByUrl('bank-payment-list');
  }

  clear() {
    this.bankPaymentForm.reset();
  }

  loadCustomers() {
    this.api.getCustomersOnly().subscribe((res) => {
      this.customerData = res.length
        ? res.map((item: any) => {
          return { name: item.companyDisplayName, id: item.ledgerCode };
        })
        : [];
    });
  }
}
