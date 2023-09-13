import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { Vendor, sref } from '../../../SalesOrderTS/SalesOrderInterface';
import { PendingpoComponent } from 'src/app/vouchers/models/pendingpo/pendingpo.component';
import { MatDialog } from '@angular/material/dialog';
import { SsoService } from 'src/app/services/sso.service';
import { SalessharedService } from '../../../SalesOrderService/salesshared.service';

@Component({
  selector: 'app-salescus',
  templateUrl: './salescus.component.html',
  styleUrls: ['./salescus.component.scss'],
})
export class SalescusComponent implements OnInit {
  constructor(
    public soapi: SsoService,
    public fb: FormBuilder,
    public dialog: MatDialog
  ) {}
  //#region variables
  formGRN!: FormGroup;
  vendoroutstanding: any = 0.0;
  filteredVendors!: Observable<Vendor[]>;
  vendorSearch = new FormControl('');
  vendorsArray: Vendor[] = [];
  vendorpodatacount = 0;
  vendorpodata: any;
  selectedvendor: any;
  vendorcode: any;
  vendorname: any;
  vendorstate: any;
  vendorstatecode: any;
  vendorgstno: any;
  vendorbilling: any;
  vendorgstTreatment: any;
  vendors: any = [];
  _branch: any = '001';
  _fy: any = '001';
  result: any;
  btnvendorchange: boolean = false;

  pono: any;
  podate: any;
  refno: any;
  salerefname: any;
  refSearch = new FormControl('');
  filteredSref!: Observable<sref[]>;
  salesRefArray: sref[] = [];
  btnsaleschange: boolean = false;

  //#endregion
  ngOnInit(): void {
    this.podate = new Date();
    this.setValidator();
    this.loadVendors();
    this.loadSaleRef();
  }
  setValidator() {
    this.formGRN = this.fb.group({
      cpono: ['', [Validators.required]],
      cpodate: ['', [Validators.required]],
      crefno: ['', [Validators.required]],
      csrefno: ['', [Validators.nullValidator]],
      cvendorname: ['', [Validators.required]],
    });
  }
  //#region salesrefernce
  loadSaleRef() {
    this.soapi.get_SaleRef().subscribe((res) => {
      this.salesRefArray = res;
      this.filteredSref = this.refSearch.valueChanges.pipe(
        startWith(''),
        map((vendor) =>
          vendor ? this._filterref(vendor) : this.salesRefArray.slice()
        )
      );
    });
  }
  private _filterref(value: string): sref[] {
    const filterValue = value.toLowerCase();
    return this.salesRefArray.filter((vendor) =>
      vendor.refname.toLowerCase().includes(filterValue)
    );
  }
  SaleRefChanged(event: any, data: any) {
    this.salerefname = data.refname;
    this.btnsaleschange = true;
  }
  changeRef() {
    this.salerefname = '';
    this.btnsaleschange = false;
  }
  //#endregion
  //#region Vendors
  loadVendors() {
    return new Promise((resolve) => {
      this.soapi.getVendors().subscribe((res) => {
        this.vendorsArray = JSON.parse(res);
        this.vendors = JSON.parse(res);
        this.filteredVendors = this.vendorSearch.valueChanges.pipe(
          startWith(''),
          map((vendor) =>
            vendor ? this._filtervendors(vendor) : this.vendorsArray.slice()
          )
        );
      });
      resolve({ action: 'success' });
    });
  }
  private _filtervendors(value: string): Vendor[] {
    const filterValue = value.toLowerCase();
    return this.vendorsArray.filter((vendor) =>
      vendor.CompanyDisplayName.toLowerCase().includes(filterValue)
    );
  }
  vendorChanged(event: any, data: any) {
    if (event.isUserInput == true) {
      this.selectedvendor = data;
      this.vendorcode = data.LedgerCode.toString();
      this.vendorname = data.CompanyDisplayName;
      this.vendorgstno = data.GSTNo;
      this.vendorbilling = data.BilingAddress;
      this.vendorgstTreatment = data.GSTTreatment;
      this.vendorstate = data.StateName;
      this.vendorstatecode = data.stateCode;
      this.btnvendorchange = true;
      // this.vendorService.setSelectedVendor(this.vendorstatecode);
    }
  }
  changeVendor() {
    this.selectedvendor = undefined;
    this.vendorcode = '';
    this.vendorname = '';
    this.vendorgstno = '';
    this.vendorbilling = '';
    this.vendorgstTreatment = '';
    this.vendorstate = '';
    this.vendorstatecode = '';
    this.vendorpodata = '';
    this.vendoroutstanding = '';
    this.vendorpodatacount = 0;
    this.btnvendorchange = false;
  }
  showPendingPODetails() {
    let dialogRef = this.dialog.open(PendingpoComponent, {
      maxWidth: '90vw',
      maxHeight: '80vh',
      height: '95%',
      width: '195%',

      panelClass: 'full-screen-modal',
    });
    dialogRef.componentInstance.polist = this.vendorpodata;
    dialogRef.afterClosed().subscribe((result) => {
      this.result = result;
    });
  }
  findvendor(code: any) {
    return new Promise((resolve) => {
      const found = this.vendors.find((obj: any) => {
        return obj.LedgerCode === parseInt(code);
      });

      if (found) {
        this.vendorname = found.CompanyDisplayName;
        this.vendorgstno = found.GSTNo;
        this.vendorbilling = found.BilingAddress;
        this.vendorgstTreatment = found.GSTTreatment;
        this.vendorstate = found.StateName;
        this.vendorstatecode = found.stateCode;

        resolve({ action: 'success' });
      }
    });
  }
  //#endregion

  // refno1(value:any)
  // {
  //   this.vendorService.setSelectedVendor(value);
  // }

  // this.formGRN.valueChanges.subscribe((formValues) => {
  //   this.vendorService.setFormValues(formValues);
  //   console.log('Form Values:', formValues);
  // });
}

//#region
// goToSOList() {
//   this.salesArray.gotolist();
// }
// vendorstatecode: any;
//   ngOnInit(): void {
//   //   this.vendorService.vendorstatecode.subscribe((vendor) => {
//   //     this.vendorstatecode = vendor;
//   //   });
//   this.vendorService.formValues.subscribe((values) => {
//     this.vendorstatecode = values; });
//   }
//#endregion
