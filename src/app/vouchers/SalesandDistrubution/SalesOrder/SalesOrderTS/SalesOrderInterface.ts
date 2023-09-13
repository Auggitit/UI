import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';

export interface iaccounts {
  acccode: string;
  accname: string;
  accvalue: string;
  acckey: string;
}
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
export interface iprodutcs {
  id: Guid;
  invno: any;
  invdate: Date;
  product: string;
  productcode: string;
  sku: string;
  hsn: string;
  godown: string;
  qty: number;
  qtymt: number;
  rate: number;
  transport: number;
  packing: number;
  insurence: number;
  subtotal: number;
  disc: number;
  discvalue: number;
  taxable: number;
  gst: number;
  gstvalue: number;
  amount: number;
  rCreatedDateTime: Date;
  rStatus: string;
  company: string;
  branch: string;
  fy: string;
  customercode: string;
  sono: string;
  sodate: string;
  vtype: string;
  sotype: string;
}
export interface Product {
  itemname: string;
  itemcode: string;
  sku: string;
  hsn: string;
  gst: string;
}
export interface gst {
  ledgername: any;
  ledgercode: any;
}
export interface igstaccounts {
  acccode: string;
  accname: string;
  accvalue: string;
  accgst: string;
  accgstvalue: string;
  accgsttotvalue: string;
  hsn: string;
}
export interface Cus {
  id: Guid;
  efieldname: string;
  efieldvalue: string;
  grnno: string;
  grntype: string;
  RCreatedDateTime: Date;
  RStatus: string;
  company: string;
  branch: string;
  fy: string;
}
export interface gstdata {
  Id: Guid;
  VchNo: string;
  VchDate: Date;
  VchType: string;
  SupplyType: string;
  HSN: string;
  Taxable: string;
  CGST_Per: number;
  SGST_Per: number;
  IGST_Per: number;
  CGST_Val: number;
  SGST_Val: number;
  IGST_Val: number;
  Total: number;
  Date: Date;
  Status: string;
}
export interface Ledger {
  id: Guid;
  acccode: any;
  vchno: any;
  vchdate: any;
  vchtype: any;
  entrytype: any;
  cr: any;
  dr: any;
  rCreatedDateTime: any;
  rStatus: any;
  Ad: string;
  gst: string;
  hsn: string;
  comp: string;
  branch: string;
  fy: string;
}
@Injectable()
export class SalesArray {
  constructor(public router: Router) {}
  ACC_DATA: iaccounts[] = [
    {
      acccode: '',
      accname: '',
      accvalue: '',
      acckey: '',
    },
  ];
  GST_DATA: igstaccounts[] = [
    {
      acccode: '',
      accname: '',
      accvalue: '0',
      accgst: '0',
      accgstvalue: '0',
      accgsttotvalue: '0',
      hsn: '',
    },
  ];
  ELEMENT_DATA: iprodutcs[] = [
    {
      id: this.getGUID(),
      invno: '1',
      invdate: new Date(),
      product: '',
      productcode: '',
      sku: '',
      hsn: '',
      godown: '',
      qty: 0,
      qtymt: 0,
      rate: 0,
      transport: 0,
      packing: 0,
      insurence: 0,
      subtotal: 0,
      disc: 0,
      discvalue: 0,
      taxable: 0,
      gst: 0,
      gstvalue: 0,
      amount: 0,
      rCreatedDateTime: new Date(),
      rStatus: 'A',
      company: '',
      branch: '',
      fy: '',
      customercode: '',
      sono: '',
      sodate: '',
      vtype: '',
      sotype: '',
    },
  ];

  getGUID() {
    var gid: any;
    gid = Guid.create();
    return gid.value;
  }
  gotolist() {
    this.router.navigateByUrl('solist');
  }
}
