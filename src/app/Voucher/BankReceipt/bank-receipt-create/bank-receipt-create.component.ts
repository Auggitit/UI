import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { map, Observable, startWith } from 'rxjs';
import { VoucherService } from 'src/app/services/voucher.service';
import { MatTableDataSource } from '@angular/material/table';
import { Guid } from 'guid-typescript';

export interface Acc {
  companyDisplayName: string;
  ledgerCode: string;
}
@Component({
  selector: 'app-bank-receipt-create',
  templateUrl: './bank-receipt-create.component.html',
  styleUrls: ['./bank-receipt-create.component.scss'],
})


export class BankReceiptCreateComponent implements OnInit {
  BankReceiptForm!: FormGroup;
  vchType = 'Bank Receipt';
  vchdate: any;
  chqdate: any;
  refdate: any;
  amount: any;
  saveAsOptions: dropDownData[] = exportOptions;
  customerData: dropDownData[] = [];
  showChequeFields: boolean = false;
  showOnlineFields: boolean = false;
  isCreateBankReceipt: boolean = true;
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
  oldid: any;

  constructor(
    public api: ApiService,
    private router: Router,
    public fb: FormBuilder,
    public activatedRoute: ActivatedRoute,
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
    this.oldid = this.activatedRoute.snapshot.paramMap.get('id');
    this.BankReceiptForm
      .get('cpaymentmode')
      ?.valueChanges.subscribe((change) => {
        this.onPaymentModeChange(change);
      });
  }

  getVoucherMaxNo(vtype: any) {
    return new Promise((resolve) => {
      this.receiptapi.getMaxInvoiceNo(vtype).subscribe((res) => {
        this.BankReceiptForm.patchValue({
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
    this.BankReceiptForm = this.fb.group({
      cvoucherno: ['', [Validators.required]],
      cvchdate: ['', [Validators.required]],
      cpaymenttype: ['', [Validators.required]],
      ccustomercode: ['', [Validators.required]],
      caccountcode: ['', [Validators.required]],
      cpaymentmode: ['', [Validators.required]],
      cvoucheramount: ['', [Validators.required]],
      cremarks: ['', [Validators.required]],
      // crefdate: ['', [Validators.required]],
      // crefno: ['', [Validators.required]],
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
    this.router.navigateByUrl('bank-receipt-list');
  }

  onClickAddButton(): void {
    this.router.navigateByUrl('bank-receipt-create');
  }

  clear() {
    this.BankReceiptForm.reset();
  }

  submit() {
    if (!this.BankReceiptForm.valid) {
      this.loading = true;
      setTimeout(() => {        
          if (this.isCreateBankReceipt) {
            this.save();
          } else if (!this.isCreateBankReceipt) {
            this.update();
          }
      }, 400);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Fill Mandatory Fields',
        text: 'Plese fill all mandatory fields',
      });
    }    
  }
  update() {}

  save() {
    this.amount = 0;
      this.insertDRLedger().then((res) => {
        this.insertCRLedger().then((res) => {
          this.insertVoucher().then((res) => {
            this.insertPaymentDues();
          });
        });
      });
    // }
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

  calculateNet() {
    var total = 0;
    for (let i = 0; i < this.dataSource.filteredData.length; i++) {
      this.dataSource.filteredData[i].received;
      total = total + parseFloat(this.dataSource.filteredData[i].received);
    }
    this.amount = total;
  }

  insertDRLedger() {
    return new Promise((resolve) => {
      var postdata = [
        {
          id: this.getGUID(),
          acccode: this.drAccountCode.toString(),
          vchno: this.BankReceiptForm.value.cvoucherno,
          vchdate: this.vchdate,
          vchtype: this.vchType,
          entrytype: 'DR',
          cr: 0,
          dr: this.amount,
          rCreatedDateTime: this.vchdate,
          rStatus: 'A',
          comp: this._company,
          branch: this._branch,
          fy: this._fy,
          ad: '',
          gst: '',
          hsn: '',
          remarks : this.BankReceiptForm.value.cremarks
        },
      ];
      this.receiptapi.Insert_Ledger(postdata).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }
  getGUID() {
    var gid: any;
    gid = Guid.create();
    return gid.value;
  }
  insertCRLedger() {
    return new Promise((resolve) => {
      var postdata = [
        {
          id: this.getGUID(),
          acccode: this.crAccountCode.toString(),
          vchno: this.BankReceiptForm.value.cvoucherno,
          vchdate: this.BankReceiptForm.value.vchdate,
          vchtype: this.vchType,
          entrytype: 'CR',
          cr: this.amount,
          dr: 0,
          rCreatedDateTime: new Date(),
          rStatus: 'A',
          comp: this._company,
          branch: this._branch,
          fy: this._fy,
          ad: '',
          gst: '',
          hsn: '',
          remarks : this.BankReceiptForm.value.cremarks
        },
      ];
      this.receiptapi.Insert_Ledger(postdata).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }
  insertVoucher() {
    return new Promise((resolve) => {
      var postdata = {
        id: this.getGUID(),
        vchno: this.BankReceiptForm.value.cvoucherno,
        vchdate: this.vchdate,
        ledgercode: this.drAccountCode.toString(),
        acccode: this.crAccountCode.toString(),
        vchtype: this.vchType,
        paymode: this.BankReceiptForm.value.cpaymentmode,
        chqno: this.BankReceiptForm.value.cchequeno,
        chqdate: this.chqdate,
        refno: this.BankReceiptForm.value.crefno,
        refdate: this.refdate,
        amount: this.amount,
        rCreatedDateTime: new Date(),
        rStatus: 'A',
        remarks : this.BankReceiptForm.value.cremarks
      };
      this.receiptapi.Insert_Voucher(postdata).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }
  insertPaymentDues() {
    // if (this.dataSource != undefined) {
    //   for (let i = 0; i < this.dataSource.filteredData.length; i++) {
    //     var invno = this.dataSource.filteredData[i].vchno;
    //     var invdate = this.dataSource.filteredData[i].invdate;
    //     var ledgercode = this.dataSource.filteredData[i].ledgercode;
    //     var amount = this.dataSource.filteredData[i].received;
    //     var dueon = this.dataSource.filteredData[i].dueon;
    //     this.insertReciept(invno, invdate, ledgercode, amount, dueon).then(
    //       (res) => {}
    //     );
    //   }
    // }
    // this.showSuccessMsg();
  }
}
