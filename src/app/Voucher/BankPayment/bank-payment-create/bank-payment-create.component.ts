import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { map, Observable, startWith } from 'rxjs';
import { VoucherService } from 'src/app/services/voucher.service';
import { MatTableDataSource } from '@angular/material/table';


export interface Acc {
  companyDisplayName: string;
  ledgerCode: string;
}
@Component({
  selector: 'app-bank-payment-create',
  templateUrl: './bank-payment-create.component.html',
  styleUrls: ['./bank-payment-create.component.scss'],
})


export class BankPaymentCreateComponent implements OnInit {
  bankPaymentForm!: FormGroup;
  vchType = 'Bank Payment';
  vchdate: any;
  chqdate: any;
  refdate: any;
  saveAsOptions: dropDownData[] = exportOptions;
  customerData: dropDownData[] = [];
  showChequeFields: boolean = false;
  showOnlineFields: boolean = false;
  isCreateBankPayment: boolean = true;
  loading: boolean = false;
  _company = '001';
  _branch = '001';
  _fy = '001';

  drAccount: any;
  crAccount: any;
  drAccountCode: any;
  crAccountCode: any;

  cusSearch = new FormControl('');

  filteredCusAccounts!: Observable<Acc[]>;
  cusArray: Acc[] = [];
  accSearch = new FormControl('');
  filteredAccounts!: Observable<Acc[]>;
  accArray: Acc[] = [];

  dataSource!: MatTableDataSource<any>;
  datalength: any;

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
    public receiptapi: VoucherService,
  ) {}

  ngOnInit(): void {
    this.getVoucherMaxNo(this.vchType);
    this.setValidations();
    //this.loadCustomers();
    this.loadVendors();
    this.loadAccounts();
    this.vchdate = new Date();
    this.chqdate = new Date();
    this.refdate = new Date();
    this.bankPaymentForm
      .get('cpaymentmode')
      ?.valueChanges.subscribe((change) => {
        this.onPaymentModeChange(change);
      });
  }

  getVoucherMaxNo(vtype: any) {
    return new Promise((resolve) => {
      this.receiptapi.getMaxInvoiceNo(vtype).subscribe((res) => {
        this.bankPaymentForm.patchValue({
          cvoucherno: res,
        });
        resolve({ action: 'success' });
      });
    });
  }

  ledgerChanged(event: any, data: any) {
    if (event.isUserInput == true) {
      this.crAccountCode = data.ledgerCode;
    }
  }

  customerChanged(event: any, data: any) {
    if (event.isUserInput == true) {
      this.drAccountCode = data.ledgerCode;
      this.loadPendingInvoices(this.drAccountCode);
    }
  }

  loadPendingInvoices(ledgercode: any) {
    this.receiptapi.getPendingVendorInvoices(ledgercode,this._branch,this._fy).subscribe((res) => {
      if (JSON.parse(res).length > 0) {
        this.dataSource = new MatTableDataSource(JSON.parse(res));
        this.datalength = JSON.parse(res).length;
      } else {
        this.datalength = 0;
      }
    });
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
      crefdate: ['', [Validators.required]],
      crefno: ['', [Validators.required]],
      cchequeno: ['', [Validators.required]],
      cchequedate: ['', [Validators.required]],
    });
  }

  onPaymentModeChange(event: any) {
    console.log('event', event);
    if (event == 'CHEQUE') {
      this.showChequeFields = true;
      this.showOnlineFields = false;
    } else if ((event = 'ONLINE')) {
      this.showChequeFields = false;
      this.showOnlineFields = true;
    } else {
      this.showChequeFields = false;
      this.showOnlineFields = false;
    }
  }

  loadVendors() {
    this.api.getAllLedgers().subscribe((res) => {
      this.cusArray = res;
      this.filteredCusAccounts = this.cusSearch.valueChanges.pipe(
        startWith(''),
        map((acc) =>
          acc ? this._filterCusAccounts(acc) : this.cusArray.slice()
        )
      );
    });
  }
  private _filterCusAccounts(value: string): Acc[] {
    const filterValue = value.toLowerCase();
    return this.cusArray.filter((acc) =>
      acc.companyDisplayName.toLowerCase().includes(filterValue)
    );
  }

  loadAccounts() {
    this.api.getAllLedgers().subscribe((res) => {
      this.accArray = res;
      this.filteredAccounts = this.accSearch.valueChanges.pipe(
        startWith(''),
        map((acc) => (acc ? this._filterAccounts(acc) : this.accArray.slice()))
      );
    });
  }
  private _filterAccounts(value: string): Acc[] {
    const filterValue = value.toLowerCase();
    return this.accArray.filter((acc) =>
      acc.companyDisplayName.toLowerCase().includes(filterValue)
    );
  }

  onClickButton(): void {
    this.router.navigateByUrl('bank-payment-list');
  }

  clear() {
    this.bankPaymentForm.reset();
  }

  submit() {
    setTimeout(() => {
      if (this.bankPaymentForm.valid) {
        this.loading = true;

        var postdata = {};
        console.log(postdata);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Fill Mandatory Fields',
          text: 'Plese fill all mandatory fields',
        });
      }
    }, 200);
  }
  update() {}

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
