import { Guid } from "guid-typescript";

export interface iprodutcs {
    id: Guid;
    grnno: any;
    grndate: Date;
    product: string;
    productcode: string;
    sku: string;
    hsn: string;
    godown: string;
    qty: number;    
    rate: number;
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
    vendorcode: string;
    pono: string;
    podate: string;
    vchtype: string;
    uom:string;
    uomcode:string
  }
  export interface iaccounts {
    acccode: string;
    accname: string;
    accvalue: number;
    acckey: string;
  }
  export interface igstaccounts {
    acccode: string;
    accname: string;
    accvalue: number;
    accgst: string;
    accgstvalue: string;
    accgsttotvalue: string;
    hsn: string;
  }
  export interface Vendor {
    CompanyDisplayName: string;
    id: string;
    BilingAddress: string;
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
  export interface Product {
    itemname: string;
    itemcode: string;
    sku: string;
    hsn: string;
    gst: string;
    uom:string;
  }
  export interface Acc {
    ledgername: string;
    ledgercode: string;
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
  export interface gst {
    ledgername: any;
    ledgercode: any;
  }
  export interface po {
    pono: any;
  }


export class Arrays {
  ELEMENT_DATA: iprodutcs[] = [
    {
      id: this.getGUID(),
      grnno: '1',
      grndate: new Date(),
      product: '',
      productcode: '',
      sku: '',
      hsn: '',
      godown: '',
      qty: 0,      
      rate: 0,
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
      vendorcode: '',
      pono: '',
      podate: '',
      vchtype: '',uom: '',uomcode: '',
    },
  ];
  GST_DATA: igstaccounts[] = [
    {
      acccode: '',
      accname: '',
      accvalue: 0,
      accgst: '',
      accgstvalue: '',
      accgsttotvalue: '',
      hsn: '',
    },
  ];
  ACC_DATA: iaccounts[] = [
    {
      acccode: '',
      accname: '',
      accvalue: 0,
      acckey: '',
    },
  ];


  getGUID() {
    var gid: any;
    gid = Guid.create();
    return gid.value;
  }
}
