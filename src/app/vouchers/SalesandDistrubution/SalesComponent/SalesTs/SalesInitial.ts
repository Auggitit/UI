import { FormControl } from '@angular/forms';

import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';

export interface Vendor {
  CompanyDisplayName: string;
  id: string;
  BilingAddress: string;
}
export interface Acc {
  ledgername: string;
  ledgercode: string;
}


export interface sref {
  refname: string;
}


export class SalesInitial {

  constructor() {
   
  }
  getGUID() {
    var gid: any;
    gid = Guid.create();
    return gid.value;
  }


  branch: any = '001';
  fy: any = '001';
  company: any = '001';
  fyname: any = '23-24';

  //#region vendors
  vendorsArray: Vendor[] = [];
  vendorSearch = new FormControl('');
  filteredVendors!: Observable<Vendor[]>;

  vendorpodatacount = 0;
  vendorpodata: any;
  selectedvendor: any;
  vendorcode: any;
  vendorname: any;
  vendorgstno: any;
  vendorbilling: any;
  vendordelivery: any;
  vendorgstTreatment: any;
  vendorstate: any;
  vendorstatecode: any;
  //#endregion
  //#region sales-layout-component
  invno: any;
  invdate: Date = new Date();
  vchtype: any = 'Service Sale';
  vchaccount: any;
  podate: any;
  pono: any;
  vchaccountcode: any;
  accArray: Acc[] = [];
  filteredAccounts!: Observable<Acc[]>;
  accSearch = new FormControl('');
  //#endregion
  //#region sales-layout-mid
  expdelidate: any;
  paymentTerm: any;
  refno: any;
  salesRefArray: sref[] = [];
  filteredSref!: Observable<sref[]>;
  refSearch = new FormControl('');
  salerefname: any;

  //#endregion
 }
