import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  dropDownData,
  exportOptions,
} from 'src/app/reports/stub/salesOrderStub';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { map, Observable, startWith } from 'rxjs';
import { VoucherService } from 'src/app/services/voucher.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ConfirmationDialogBoxComponent } from 'src/app/shared/components/confirmation-dialog-box/confirmation-dialog-box.component';
import { ListingTableDialogComponent } from 'src/app/shared/components/listing-table-dialog/listing-table-dialog.component';
import { Guid } from 'guid-typescript';
export interface Acc {
  companyDisplayName: string;
  ledgerCode: string;
}
@Component({
  selector: 'app-cash-payment-create',
  templateUrl: './cash-payment-create.component.html',
  styleUrls: ['./cash-payment-create.component.scss']
})
export class CashPaymentCreateComponent implements OnInit {
  cashPaymentForm!: FormGroup;
  oldid: any;
  vchType = 'Cash Payment';
  vchdate: any;
  chqdate: any;
  refdate: any;
  saveAsOptions: dropDownData[] = exportOptions;
  customerData: dropDownData[] = [];
  showChequeFields: boolean = false;
  showOnlineFields: boolean = false;
  isCreateCashPayment: boolean = true;
  loading: boolean = false;
  _company = '001';
  _branch = '001';
  _fy = '001';
  vchno: any;

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

  paymentList: any = [];
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
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setValidations();
    this.loadVendors();
    this.loadAccounts();
    this.cashPaymentForm
      .get('cpaymentmode')
      ?.valueChanges.subscribe((change) => {
        this.onPaymentModeChange(change);
      });

    this.oldid = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('oldid', this.oldid);

    if (this.activatedRoute.snapshot.queryParams['type'] == 'edit') {
      this.isCreateCashPayment = false;
      if (this.oldid !== null) {
        this.vchno = decodeURIComponent(this.oldid).trim();
        this.loadPreviousBills();
      }
    } else {
      this.vchdate = new Date();
      this.chqdate = new Date();
      this.refdate = new Date();
    }
    this.getVoucherMaxNo(this.vchType);
  }

  loadPreviousBills() {
    this.loadSavedVoucherList(this.vchno, this.vchType).then((res) => {
      this.loadSavedInvoicesList(this.drAccountCode, this.vchno);
    });
  }

  loadSavedVoucherList(vchno: any, vchtype: any) {
    return new Promise((resolve) => {
      this.receiptapi.getVoucherListForEdit(vchno, vchtype).subscribe((res) => {
        if (JSON.parse(res).length > 0) {
          var val = JSON.parse(res);
          console.log('update fetched val', val);

          this.vchdate = val[0].vchdate;
          this.drAccountCode = val[0].ledgercode;
          this.drAccount = val[0].ledgername;
          this.crAccountCode = val[0].acccode;
          this.crAccount = val[0].accname;
          this.cashPaymentForm.patchValue({
            cvoucherno: vchno,
            cvchdate: val[0].vchdate,
            //cpaymenttype: ['', [Validators.required]],
            // ccustomercode: ['', [Validators.required]],
            //caccountcode: ['', [Validators.required]],
            cpaymentmode: val[0].paymode,
            cvoucheramount: val[0].amount,
            cremarks: val[0].remarks,
            crefdate: new Date(val[0].refdate),
            crefno: val[0].refno,
            cchequeno: val[0].chqno,
            cchequedate: new Date(val[0].chqdate),
          });
          this.chqdate = new Date(val[0].chqdate);
          this.refdate = new Date(val[0].refdate);
          resolve({ action: 'success' });
        }
      });
    });
  }

  loadSavedInvoicesList(ledgercode: any, vchno: any) {
    return new Promise((resolve) => {
      this.receiptapi
        .getPendingVendorInvoicesForEdit(ledgercode, vchno, this.vchType)
        .subscribe((res) => {
          if (JSON.parse(res).length > 0) {
            this.dataSource = new MatTableDataSource(JSON.parse(res));
            this.datalength = JSON.parse(res).length;
            resolve({ action: 'success' });
          } else {
            this.datalength = 0;
            resolve({ action: 'success' });
          }
        });
    });
  }

  //to get maximum voucher number and decide new number
  getVoucherMaxNo(vtype: any) {
    if (this.activatedRoute.snapshot.queryParams['type'] == 'edit') {
      this.cashPaymentForm.patchValue({
        cvoucherno: decodeURIComponent(this.oldid).trim(),
      });
      return;
    } else {
      return new Promise((resolve) => {
        this.receiptapi.getMaxInvoiceNo(vtype).subscribe((res) => {
          this.cashPaymentForm.patchValue({
            cvoucherno: res,
          });
          this.cashPaymentForm.patchValue({
            cvchdate: new Date(),
          });
          resolve({ action: 'success' });
        });
      });
    }
  }

  ledgerChanged(event: any, data: any) {
    if (event.isUserInput == true) {
      this.crAccountCode = data.ledgerCode;
    }
  }

  customerChanged(event: any, data: any) {
    console.log('Customer Changed');
    console.log('event', event);
    console.log('data', data);

    if (event.isUserInput == true) {
      this.drAccountCode = data.ledgerCode;
      this.loadPendingInvoices(this.drAccountCode);
    }
  }


  loadPendingInvoices(ledgercode: any) {
    console.log('ledgercode', ledgercode);
    //this.fetchPendingData(ledgercode);

    // console.log("pending data",this.dataSource)
    const dialogRef = this.dialog.open(ListingTableDialogComponent, {
      data: {
        ledgerCode: ledgercode,
        _branch: this._branch,
        _fy: this._fy,
        isCreate: this.isCreateCashPayment,
        vchno: this.vchno,
        vchtype: this.vchType,
      },
    });
    dialogRef.afterClosed().subscribe((paymentData) => {
      if (paymentData) {
        console.log('fileterdata amount', paymentData);
        this.cashPaymentForm.patchValue({
          cvoucheramount: paymentData[1],
        });
        this.paymentList = paymentData[0];
      }
    });
  }

  setValidations() {
    this.cashPaymentForm = this.fb.group({
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
    this.router.navigateByUrl('cash-payment-list');
  }

  clear() {
    this.cashPaymentForm.reset();
    this.drAccount = '';
    (this.drAccountCode = ''), (this.crAccount = '');
    (this.crAccountCode = ''), this.getVoucherMaxNo(this.vchType);
    this.showChequeFields = false;
    this.showOnlineFields = false;
  }

  submit() {
    var res = this.validate();
    if (res == true) {
      this.loading = true;
      this.insertDRLedger().then((res) => {
        this.insertCRLedger().then((res) => {
          this.insertVoucher().then((res) => {
            this.insertPaymentDues();
            this.showSuccessMsg();
          });
        });
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Fill Mandatory Fields',
        text: 'Plese fill all mandatory fields',
      });
    }
  }

  insertDRLedger() {
    console.log('inside insert dr');

    return new Promise((resolve) => {
      var postdata = [
        {
          id: this.getGUID(),
          acccode: this.drAccountCode.toString(),
          vchno: this.cashPaymentForm.get('cvoucherno')?.value?.toString(),
          vchdate: new Date(this.cashPaymentForm.get('cvchdate')?.value),
          vchtype: this.vchType,
          entrytype: 'DR',
          cr: 0,
          dr: this.cashPaymentForm.get('cvoucheramount')?.value,
          rCreatedDateTime: new Date(),
          rStatus: 'A',
          comp: this._company,
          branch: this._branch,
          fy: this._fy,
          ad: '',
          gst: '',
          hsn: '',
          remarks: this.cashPaymentForm.get('cremarks')?.value,
        },
      ];
      console.log('postdata===1', postdata);
      try {
        this.receiptapi.Insert_Ledger(postdata).subscribe((res) => {
          console.log('res---1', res);
          resolve({ action: 'success' });
        });
      } catch (err) {
        console.log(err);
      }
    });
  }

  insertCRLedger() {
    console.log('inside cr insert');

    return new Promise((resolve) => {
      var postdata = [
        {
          id: this.getGUID(),
          acccode: this.crAccountCode.toString(),
          vchno: this.cashPaymentForm.get('cvoucherno')?.value?.toString(),
          vchdate: new Date(this.cashPaymentForm.get('cvchdate')?.value),
          vchtype: this.vchType,
          entrytype: 'CR',
          cr: this.cashPaymentForm.get('cvoucheramount')?.value,
          dr: 0,
          rCreatedDateTime: new Date(),
          rStatus: 'A',
          comp: this._company,
          branch: this._branch,
          fy: this._fy,
          ad: '',
          gst: '',
          hsn: '',
          remarks: this.cashPaymentForm.get('cremarks')?.value,
        },
      ];
      console.log('postdata===2', postdata);
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

  insertVoucher() {
    console.log(
      'in voc dtata inside voucher',
      this.cashPaymentForm.get('cvoucherno')?.value,
      this.drAccountCode,
      this.crAccountCode
    );

    return new Promise((resolve) => {
      var postdata = {
        id: this.getGUID(),
        vchno: this.cashPaymentForm.get('cvoucherno')?.value?.toString(),
        vchdate: new Date(this.cashPaymentForm.get('cvchdate')?.value),
        ledgercode: this.drAccountCode?.toString(),
        acccode: this.crAccountCode?.toString(),
        vchtype: this.vchType,
        paymode: this.cashPaymentForm.get('cpaymentmode')?.value,
        chqno: this.cashPaymentForm.get('cchequeno')?.value,
        chqdate: new Date(this.cashPaymentForm.get('cchequedate')?.value),
        refno: this.cashPaymentForm.get('crefno')?.value,
        refdate: new Date(this.cashPaymentForm.get('crefdate')?.value),
        amount: this.cashPaymentForm.get('cvoucheramount')?.value,
        rCreatedDateTime: new Date(),
        rStatus: 'A',
        remarks: this.cashPaymentForm.get('cremarks')?.value,
      };
      console.log('post data====vouch', postdata);

      this.receiptapi.Insert_Voucher(postdata).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }

  insertPaymentDues() {
    console.log('inside payment dues');

    let paymentListTemp = this.paymentList[0];
    console.log('paymentListTemp', paymentListTemp);
    if (paymentListTemp != undefined) {
      for (let i = 0; i < paymentListTemp.length; i++) {
        var invno = paymentListTemp[i].vchno;
        var invdate = paymentListTemp[i].grndate;
        var ledgercode = paymentListTemp[i].ledgercode;
        var amount = paymentListTemp[i].amountToPay;
        var dueon = paymentListTemp[i].dueon;
        this.insertPayment(invno, invdate, ledgercode, amount, dueon).then(
          (res) => {
            console.log('res=insert payment dues', res);
          }
        );
      }
    }
  }

  insertPayment(
    invno: any,
    invdate: any,
    ledgercode: any,
    amount: any,
    dueon: any
  ) {
    console.log('?????', invno, invdate, ledgercode, amount, dueon);
    return new Promise((resolve) => {
      var postdata = {
        id: this.getGUID(),
        entrytype: 'VENDOR_OVERDUE',
        vouchertype: this.vchType,
        vchno: invno,
        vchdate: new Date(invdate),
        ledgercode: ledgercode.toString(),
        amount: amount,
        received: amount,
        dueon: new Date(dueon),
        status: 'UNPAID',
        comp: this._company,
        branch: this._branch,
        fy: this._fy,
        rCreatedDateTime: new Date(),
        rStatus: 'A',
        remarks: this.cashPaymentForm.get('cremarks')?.value,
        entryno: this.cashPaymentForm.get('cvoucherno')?.value?.toString(),
      };
      console.log('insertPayment', postdata);
      this.receiptapi.Insert_InvocieDueDetails(postdata).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }

  showSuccessMsg() {
    let dialogRef = this.dialog.open(SuccessmsgComponent, {
      data: 'Payment Successfully Saved!',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.clear();
      this.loading = false;
    });
  }

  update() {
    console.log('update called');
    var res = this.validate();
    if (res == true) {
      this.loading = true;
      this.deleteExistingEntries().then((res) => {
        this.insertDRLedger().then((res) => {
          this.insertCRLedger().then((res) => {
            this.insertVoucher().then((res) => {
              this.insertPaymentDues();
              this.showSuccessMsg();
            });
          });
        });
      });
    }
  }

  deleteExistingEntries() {
    return new Promise((resolve) => {
      this.deleteVoucher().then((res) => {
        this.deleteledger().then((res) => {
          this.deleteOverdue().then((res) => {
            resolve({ action: 'success' });
          });
        });
      });
    });
  }

  deleteVoucher() {
    console.log('inside delete voucher');

    return new Promise((resolve) => {
      this.receiptapi
        .delete_voucher(this.vchno, this.vchType, this._branch, this._fy)
        .subscribe((res) => {
          resolve({ action: 'success' });
        });
    });
  }

  deleteledger() {
    console.log('inside delete ledger');

    return new Promise((resolve) => {
      this.receiptapi
        .delete_ledger(this.vchno, this.vchType, this._branch, this._fy)
        .subscribe((res) => {
          resolve({ action: 'success' });
        });
    });
  }
  deleteOverdue() {
    console.log('inside delete overdue');

    return new Promise((resolve) => {
      this.receiptapi
        .delete_overdue(this.vchno, this.vchType, this._branch, this._fy)
        .subscribe((res) => {
          resolve({ action: 'success' });
        });
    });
  }

  validate() {
    //return true;
    if (this.drAccountCode == '' || this.drAccountCode == undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Please Select!',
        text: 'Please Select Customer Account!',
      });
      return false;
    } else if (this.crAccountCode == '' || this.crAccountCode == undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Please Select!',
        text: 'Please Select Account!',
      });
      return false;
    } else if (
      this.cashPaymentForm.get('cpaymentmode')?.value == '' ||
      this.cashPaymentForm.get('cpaymentmode')?.value == undefined
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Please Select!',
        text: 'Please Select Payment Mode!',
      });
      return false;
    } else if (
      this.cashPaymentForm.get('cpaymentmode')?.value == 'CHEQUE' &&
      (this.cashPaymentForm.get('cchequeno')?.value == undefined ||
        this.cashPaymentForm.get('cchequeno')?.value == '' ||
        this.cashPaymentForm.get('cchequedate')?.value == undefined ||
        this.cashPaymentForm.get('cchequedate')?.value == '')
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Please Fill!',
        text: 'Please Enter Check Details!',
      });
      return false;
    } else if (
      this.cashPaymentForm.get('cpaymentmode')?.value == 'ONLINE' &&
      (this.cashPaymentForm.get('crefno')?.value == undefined ||
        this.cashPaymentForm.get('crefno')?.value == '' ||
        this.cashPaymentForm.get('crefdate')?.value == undefined ||
        this.cashPaymentForm.get('crefdate')?.value == '')
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Please Fill!',
        text: 'Please Enter Online Reference Details!',
      });
      return false;
    } else if (
      this.cashPaymentForm.get('cvoucheramount')?.value == '' ||
      this.cashPaymentForm.get('cvoucheramount')?.value == undefined
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Please Fill!',
        text: 'Please Enter Total Amount!',
      });
      return false;
    } else {
      return true;
    }
  }
}
