import { ViewportScroller } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ɵpublishDefaultGlobalUtils,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { map, Observable, of, startWith, VirtualTimeScheduler } from 'rxjs';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { GrnService } from 'src/app/services/grn.service';
import { PoService } from 'src/app/services/po.service';
import Swal from 'sweetalert2';

//#region interface
export interface igstaccounts {
  acccode: string;
  accname: string;
  accvalue: string;
  accgst: string;
  accgstvalue: string;
  accgsttotvalue: string;
  hsn: string;
}
export interface Acc {
  ledgername: string;
  ledgercode: string;
}
export interface Vendor {
  CompanyDisplayName: string;
  id: string;
  BilingAddress: string;
}
export interface Product {
  itemname: string;
  itemcode: string;
  sku: string;
  hsn: string;
  gst: string;
  uom: any;
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
  gst: any;
  hsn: any;
  rCreatedDateTime: any;
  rStatus: any;
  branch: string;
  comp: string;
  fy: string;
}
export interface iaccounts {
  acccode: string;
  accname: string;
  accvalue: string;
  acckey: string;
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
export interface iprodutcs {
  grnno?: string;
  grndate?: Date;
  vchtype?: string;
  id: Guid;
  pono: any;
  podate: Date;
  godown: string;
  product: string;
  productcode: string;
  sku: string;
  hsn: string;
  qty: number;
  // qtymt: string;
  rate: number;
  transport?: number;
  packing?: number;
  insurence?: number;
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
  potype?: string;
  uom: string;
  uomcode: string;
}
export interface gst {
  ledgername: any;
  ledgercode: any;
}
export interface Cus {
  id: Guid;
  efieldname: string;
  efieldvalue: string;
  pono?: string;
  potype?: string;
  RCreatedDateTime: Date;
  RStatus: string;
  company: string;
  branch: string;
  fy: string;
}
//#endregion
@Component({
  selector: 'app-po',
  templateUrl: './po.component.html',
  styleUrls: ['./po.component.scss'],
})
export class PoComponent implements OnInit {
  //#region Viewchild
  @ViewChild('table') tabledata!: MatTable<Element>;
  @ViewChildren('eprod') private eprod!: QueryList<ElementRef>;
  @ViewChildren('eqty') private eqty!: QueryList<ElementRef>;
  @ViewChildren('erate') private erate!: QueryList<ElementRef>;
  @ViewChildren('edisc') private edisc!: QueryList<ElementRef>;
  @ViewChildren('etax') private etax!: QueryList<ElementRef>;
  @ViewChildren('eamt') private eamt!: QueryList<ElementRef>;
  //Venndors
  @ViewChild('epodate') epodate: ElementRef | undefined;
  @ViewChild('evendorname') evendorname: ElementRef | undefined;
  @ViewChildren('eAddCharge') private eAddCharge!: QueryList<ElementRef>;
  @ViewChildren('eAddGstDD') private eAddGstDD!: QueryList<ElementRef>;
  //#endregion
  //#region Arrays
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
  ACC_DATA: iaccounts[] = [
    {
      acccode: '',
      accname: '',
      accvalue: '',
      acckey: '',
    },
  ];
  ELEMENT_DATA: iprodutcs[] = [
    {
      id: this.getGUID(),
      godown: '',
      pono: 1,
      podate: new Date(),
      product: '',
      productcode: '',
      sku: '',
      hsn: '',
      qty: 0,
      //  qtymt:'',
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
      vendorcode: '',
      potype: '',
      uom: '',
      uomcode: '',
    },
  ];
  //#endregion
  //#region initial variables
  loading: boolean = false;
  vendorSearch = new FormControl();
  filteredVendors!: Observable<Vendor[]>;
  acclistData!: MatTableDataSource<any>;
  dataSource = this.ELEMENT_DATA;
  tcsrate: any = 0.0;
  roundedoff: any = 0.0;
  //#endregion
  //#region constructor
  constructor(
    public router: Router,
    public fb: FormBuilder,
    public poapi: PoService,
    public dialog: MatDialog,
    public grnapi: GrnService,
    private viewportScroller: ViewportScroller
  ) {}
  //#endregion
  //#region onInit
  podate: any;
  ngOnInit(): void {
    this.podate = new Date();
    this.viewportScroller.scrollToPosition([0, 0]);
    this.gstArray.splice(0);
    this.gstArray.push({ gst: 'NO GST', hsn: '' });
    this.setValidator();
    this.loadVendors();
    this.loadDefalutAccounts();
    this.loadSavedAccounts();
    this.loadProducts();
    this.getMaxPoNo();
    this.loadpdef();
    this.emptyrowonload();
    this.loadgst();
    this.loadgstwithvalue();
  }
  loadgstwithvalue() {
    for (var i = 0; i < this.gstlistData.data.length; i++) {
      this.gstlistData.filteredData[i].accgst = 'NO GST';
    }
  }

  //#endregion
  //#region formgroup
  //#region ngModel form variables
  pono: any;
  refno: any;
  //#endregion
  //#region setValidators
  formGRN!: FormGroup;
  setValidator() {
    this.formGRN = this.fb.group({
      cinvno: ['', [Validators.nullValidator]],
      cinvdate: ['', [Validators.nullValidator]],
      cvendorname: ['', [Validators.required]],
      cpono: ['', [Validators.required]],
      cpodate: ['', [Validators.required]],
      cvchtype: ['', [Validators.nullValidator]],
      cvchaccount: ['', [Validators.nullValidator]],
      crefno: ['', [Validators.nullValidator]],
      csubinvno: ['', [Validators.nullValidator]],
      csupinvdate: ['', [Validators.nullValidator]],
      cexpdelidate: ['', [Validators.nullValidator]],
      cpaymentTerm: ['', [Validators.nullValidator]],
    });
  }
  //#endregion
  //#endregion
  //#region Select Vendors
  //#region vendor variables
  selectedvendor: any;
  vendorcode: any;
  vendorname: any;
  vendorgstno: any;
  vendorbilling: any;
  vendorgstTreatment: any;
  vendorstate: any;
  vendorstatecode: any;

  vendoroutstanding: any = 0.0;
  //#endregion
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
      this.grnapi
        .getPendingPoOutstanding(data.LedgerCode, this._branch, this._fy)
        .subscribe((res) => {
          this.vendoroutstanding = res[0].net_balance;
        });
      this.calculate();
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
  }
  //#endregion
  //#region loadVendors
  vendorsArray: Vendor[] = [];
  loadVendors() {
    this.poapi.getVendors().subscribe((res) => {
      this.vendorsArray = JSON.parse(res);
      this.filteredVendors = this.vendorSearch.valueChanges.pipe(
        startWith(''),
        map((vendor) =>
          vendor ? this._filtervendors(vendor) : this.vendorsArray.slice()
        )
      );
    });
  }
  private _filtervendors(value: string): Vendor[] {
    const filterValue = value.toLowerCase();
    return this.vendorsArray.filter((vendor) =>
      vendor.CompanyDisplayName.toLowerCase().includes(filterValue)
    );
  }
  //#endregion
  //#region loadsdef
  sdef: any;
  loadpdef() {
    this.poapi.getDefPOFields().subscribe((res) => {
      this.sdef = res;
    });
  }
  //#endregion
  //#region Tables
  //#region Table Variable
  listData!: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'product',
    'qty',
    // 'qtymt',
    'rate',
    'subtotal',
    'disc',
    'taxable',
    'gst',
    'amount',
    'select',
  ];
  //#endregion
  //#region Product
  loadProducts() {
    this.poapi.getProducts().subscribe((res) => {
      // this.prodArray = res.map((e: any) => {
      //   return {
      //     itemname: e.mItem.itemname,
      //     itemcode: e.mItem.itemcode,
      //     sku: e.mItem.sku,
      //     hsn: e.mItem.hsn,
      //     gst: e.mItem.gst,
      //     uom: e.uomName
      //   };
      // });
      this.prodArray = JSON.parse(res);
      console.log('Prod', this.prodArray);
    });
  }
  prodArray: Product[] = [];
  onProdKeydown(event: any, rowindex: any) {
    //this.egodown.toArray()[rowindex].nativeElement.value = "";
    this.eqty.toArray()[rowindex].nativeElement.select();
    this.eqty.toArray()[rowindex].nativeElement.focus();
  }
  filterProducts(name: string) {
    return (
      (name &&
        this.prodArray.filter((items) =>
          items.itemname.toLowerCase().includes(name?.toLowerCase())
        )) ||
      this.prodArray
    );
  }
  prodChanged(event: any, data: any, rowindex: any) {
    if (event.isUserInput == true) {
      console.log(data);
      this.listData.filteredData[rowindex].product = data.itemname.toString();
      this.listData.filteredData[rowindex].productcode =
        data.itemcode.toString();
      this.listData.filteredData[rowindex].sku = data.itemsku;
      this.listData.filteredData[rowindex].hsn = data.itemhsn;
      this.listData.filteredData[rowindex].uom = data.uom;
      this.listData.filteredData[rowindex].uomcode = data.uomcode.toString();
      this.listData.filteredData[rowindex].gst = data.gst;
      console.log(this.listData.filteredData);
    }
  }
  //#endregion
  //#region load saved acc
  purchaseDiscountAcc: any;
  transportAcc: any;
  packingAcc: any;
  insurenceAcc: any;
  tcsAcc: any;
  roundingAcc: any;
  loadSavedAccounts() {
    this.grnapi.getSavedAccounts().subscribe((res) => {
      //  console.log(res);
      this.purchaseDiscountAcc = res[0].discAcc;
      this.transportAcc = res[0].tranAcc;
      this.packingAcc = res[0].packAcc;
      this.insurenceAcc = res[0].insuAcc;
      this.tcsAcc = res[0].tcsAcc;
      this.roundingAcc = res[0].rounding;
    });
  }
  //#endregion

  //#region ADDon
  onAddonRateKeydown(event: any, rowindex: any) {
    var qty = this.listData.filteredData[rowindex].qty;
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if (qty === '' || qty === null) {
      qty = 0;
    }
    if (rate === '' || rate === null) {
      rate = 0;
    }
    if (disc === '' || disc === null) {
      disc = 0;
    }
    if (gst === '' || gst === null) {
      gst = 0;
    }
    this.onCalculation(qty, rate, disc, gst, rowindex);
    this.calculate();
  }
  //#endregion
  //#region Qty
  onQtyKeydown(event: any, rowindex: any) {
    var qty = this.listData.filteredData[rowindex].qty;
    var qty = this.listData.filteredData[rowindex].qty;
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if (qty === '' || qty === null) {
      qty = 0;
    }
    if (rate === '' || rate === null) {
      rate = 0;
    }
    if (disc === '' || disc === null) {
      disc = 0;
    }
    if (gst === '' || gst === null) {
      gst = 0;
    }
    this.onCalculation(qty, rate, disc, gst, rowindex);
    this.calculate();
    this.erate.toArray()[rowindex].nativeElement.select();
    this.erate.toArray()[rowindex].nativeElement.focus();
  }
  //#endregion
  //#region Basic Rate
  onRateChange(event: any, rowindex: any) {
    var qty = this.listData.filteredData[rowindex].qty;
    var qty = this.listData.filteredData[rowindex].qty;
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if (qty === '' || qty === null) {
      qty = 0;
    }
    if (rate === '' || rate === null) {
      rate = 0;
    }
    if (disc === '' || disc === null) {
      disc = 0;
    }
    if (gst === '' || gst === null) {
      gst = 0;
    }
    this.onCalculation(qty, rate, disc, gst, rowindex);
    this.calculate();
    this.listData.filteredData[rowindex].rate = rate;
  }
  onRateKeydown(event: any, rowindex: any) {
    //if (event.key === "Enter") {
    var qty = this.listData.filteredData[rowindex].qty;
    var qty = this.listData.filteredData[rowindex].qty;
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if (qty === '' || qty === null) {
      qty = 0;
    }
    if (rate === '' || rate === null) {
      rate = 0;
    }
    if (disc === '' || disc === null) {
      disc = 0;
    }
    if (gst === '' || gst === null) {
      gst = 0;
    }
    this.onCalculation(qty, rate, disc, gst, rowindex);
    this.calculate();
    this.listData.filteredData[rowindex].rate = rate;
    this.edisc.toArray()[rowindex].nativeElement.select();
    this.edisc.toArray()[rowindex].nativeElement.focus();
    //}
  }
  //#endregion
  //#region Discount
  onDiscKeydown(event: any, rowindex: any) {
    var qty = this.listData.filteredData[rowindex].qty;
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if (qty === '' || qty === null) {
      qty = 0;
    }
    if (rate === '' || rate === null) {
      rate = 0;
    }
    if (disc === '' || disc === null) {
      disc = 0;
    }
    if (gst === '' || gst === null) {
      gst = 0;
    }
    this.onCalculation(qty, rate, disc, gst, rowindex);
    this.calculate();
    this.etax.toArray()[rowindex].nativeElement.select();
    this.etax.toArray()[rowindex].nativeElement.focus();
  }
  onDiscChange(event: any, rowindex: any) {
    var qty = this.listData.filteredData[rowindex].qty;
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if (qty === '' || qty === null) {
      qty = 0;
    }
    if (rate === '' || rate === null) {
      rate = 0;
    }
    if (disc === '' || disc === null) {
      disc = 0;
    }
    if (gst === '' || gst === null) {
      gst = 0;
    }
    this.onCalculation(qty, rate, disc, gst, rowindex);
    this.calculate();
  }
  //#endregion
  //#region GST
  gstArray = [{ gst: '', hsn: '' }];
  onTaxKeyChange(event: any, rowindex: any) {
    var qty = this.listData.filteredData[rowindex].qty;
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if (qty === '' || qty === null) {
      qty = 0;
    }
    if (rate === '' || rate === null) {
      rate = 0;
    }
    if (disc === '' || disc === null) {
      disc = 0;
    }
    if (gst === '' || gst === null) {
      gst = 0;
    }
    this.onCalculation(qty, rate, disc, gst, rowindex);
    this.calculate();
  }
  //#region  on tax
  gstlistData!: MatTableDataSource<any>;
  onTaxKeydown(event: any, rowindex: any) {
    var qty = this.listData.filteredData[rowindex].qty;
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if (qty === '' || qty === null) {
      qty = 0;
    }
    if (rate === '' || rate === null) {
      rate = 0;
    }
    if (disc === '' || disc === null) {
      disc = 0;
    }
    if (gst === '' || gst === null) {
      gst = 0;
    }
    this.onCalculation(qty, rate, disc, gst, rowindex);
    this.calculate();
    this.eamt.toArray()[rowindex].nativeElement.focus();

    for (let i = 0; i < this.listData.filteredData.length; i++) {
      if (i == 0) {
        var rgst = this.listData.filteredData[i].gst;
        var rhsn = this.listData.filteredData[i].hsn;
        this.gstArray.splice(0);
        this.gstArray.push({ gst: 'NO GST', hsn: '' });
        this.gstArray.push({ gst: rgst, hsn: rhsn });
      } else {
        var prgst = this.listData.filteredData[i - 1].gst;
        var rhsn = this.listData.filteredData[i].hsn;
        var rgst = this.listData.filteredData[i].gst;
        if (parseFloat(rgst) > parseFloat(prgst)) {
          this.gstArray.splice(0);
          this.gstArray.push({ gst: 'NO GST', hsn: '' });
          this.gstArray.push({ gst: rgst, hsn: rhsn });
        }
      }
    }

    console.log(this.gstlistData.filteredData, 'NO GST');
    for (let i = 0; i < this.gstlistData.filteredData.length; i++) {
      this.gstlistData.filteredData[i].accgst = 'NO GST';
      this.gstlistData.filteredData[i].accgsttotvalue =
        this.gstlistData.filteredData[i].accvalue;
      this.gstlistData.filteredData[i].accgstvalue = '0';
    }
    this.calculate();
  }

  //#endregion
  //#endregion
  //#region Amount
  onAmountKeydown(event: any, rowindex: any) {
    var qty = this.listData.filteredData[rowindex].qty;
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if (qty === '' || qty === null) {
      qty = 0;
    }
    if (rate === '' || rate === null) {
      rate = 0;
    }
    if (disc === '' || disc === null) {
      disc = 0;
    }
    if (gst === '' || gst === null) {
      gst = 0;
    }
    this.onCalculation(qty, rate, disc, gst, rowindex);
    if (rowindex + 1 == this.listData.data.length) {
      this.addRow().then((res) => {
        setTimeout(() => {
          this.eprod.toArray()[rowindex + 1].nativeElement.select();
          this.eprod.toArray()[rowindex + 1].nativeElement.focus();
        }, 500);
      });
    } else {
      this.eprod.toArray()[rowindex + 1].nativeElement.select();
      this.eprod.toArray()[rowindex + 1].nativeElement.focus();
    }
    this.calculate();
  }
  //#endregion

  //#endregion
  //#region Add,Remove
  accremoveAll() {
    this.acclistData.data.splice(0, this.acclistData.data.length);
    this.acclistData.data = [...this.acclistData.data]; // new ref!
    of(this.ACC_DATA).subscribe(
      (data: iaccounts[]) => {
        this.acclistData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
    //this.addNewAccDataRow();
    console.log(this.acclistData.filteredData, 'Remove All');
  }

  addAccDataRow(acode: any, aname: any, avalue: any, akey: any) {
    if (this.acclistData.filteredData)
      var obj = this.acclistData.filteredData.find((o) => o.acccode === acode);
    if (obj == undefined || obj.length == 0) {
      return new Promise((resolve) => {
        const newRow = {
          acccode: acode,
          accname: aname,
          accvalue: avalue,
          acckey: akey,
        };
        this.ACC_DATA.push(newRow);
        of(this.ACC_DATA).subscribe(
          (data: iaccounts[]) => {
            this.acclistData = new MatTableDataSource(data);
          },
          (error) => {
            console.log(error);
          }
        );
        resolve({ action: 'success' });
      });
    } else {
      return new Promise((resolve) => {
        resolve({ action: 'success' });
      });
    }
  }

  gstaddRow() {
    return new Promise((resolve) => {
      const newRow = {
        acccode: '',
        accname: '',
        accvalue: '0',
        accgst: '0',
        accgstvalue: '0',
        accgsttotvalue: '0',
        hsn: '',
      };
      this.GST_DATA.push(newRow);
      of(this.GST_DATA).subscribe(
        (data: igstaccounts[]) => {
          this.gstlistData = new MatTableDataSource(data);
        },
        (error) => {
          console.log(error);
        }
      );
      this.findGst();
      resolve({ action: 'success' });
    });
  }

  findGst() {
    for (let i = 0; i < this.listData.filteredData.length; i++) {
      if (i == 0) {
        var rgst = this.listData.filteredData[i].gst;
        var rhsn = this.listData.filteredData[i].hsn;
        this.gstArray.splice(0);
        this.gstArray.push({ gst: 'NO GST', hsn: '' });
        this.gstArray.push({ gst: rgst, hsn: rhsn });
      } else {
        var prgst = this.listData.filteredData[i - 1].gst;
        var rhsn = this.listData.filteredData[i].hsn;
        var rgst = this.listData.filteredData[i].gst;
        if (parseFloat(rgst) > parseFloat(prgst)) {
          this.gstArray.splice(0);
          this.gstArray.push({ gst: 'NO GST', hsn: '' });
          this.gstArray.push({ gst: rgst, hsn: rhsn });
        }
      }
    }
  }

  gstremove(index: any) {
    if (this.gstlistData.data.length > 1) {
      this.gstlistData.data.splice(index, 1);
      this.gstlistData.data = [...this.gstlistData.data]; // new ref!
      of(this.GST_DATA).subscribe(
        (data: igstaccounts[]) => {
          this.gstlistData = new MatTableDataSource(data);
        },
        (error) => {
          console.log(error);
        }
      );
      this.calculate();
    }
  }

  addRow() {
    return new Promise((resolve) => {
      const newRow = {
        id: this.getGUID(),
        godown: '',
        pono: 1,
        podate: this.podate,
        product: '',
        productcode: '',
        sku: '',
        hsn: '',
        qty: 0,
        qtymt: '',
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
        vendorcode: '',
        potype: '',
        uom: '',
        uomcode: '',
      };
      this.ELEMENT_DATA.push(newRow);

      of(this.ELEMENT_DATA).subscribe(
        (data: iprodutcs[]) => {
          this.listData = new MatTableDataSource(data);
        },
        (error) => {
          console.log(error);
        }
      );
      resolve({ action: 'success' });
    });
  }

  removeAll() {
    this.listData.data.splice(0, this.listData.data.length);
    this.listData.data = [...this.listData.data]; // new ref!
    of(this.ELEMENT_DATA).subscribe(
      (data: iprodutcs[]) => {
        this.listData = new MatTableDataSource(data);
        // console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
    this.addRow();
    this.gstlistData.data.splice(0, this.gstlistData.data.length);
    this.gstlistData.data = [...this.gstlistData.data]; // new ref!
    of(this.GST_DATA).subscribe(
      (data: igstaccounts[]) => {
        this.gstlistData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
    this.gstaddRow();
    this.calculate();
  }
  remove(index: any) {
    if (this.listData.data.length > 1) {
      this.listData.data.splice(index, 1);
      this.listData.data = [...this.listData.data]; // new ref!
      of(this.ELEMENT_DATA).subscribe(
        (data: iprodutcs[]) => {
          this.listData = new MatTableDataSource(data);
          // console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
      // console.log(this.listData);
      this.calculate();
    }
    this.calculate();
  }
  emptyrowonload() {
    //Add Empty Line to data GRID
    of(this.ELEMENT_DATA).subscribe(
      (data: iprodutcs[]) => {
        this.listData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
    //Add Empty Line to Accounts GRID
    of(this.ACC_DATA).subscribe(
      (data: iaccounts[]) => {
        this.acclistData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
    //Add Empty Line to GST Accounts GRID
    of(this.GST_DATA).subscribe(
      (data: igstaccounts[]) => {
        this.gstlistData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
    this.calculate();
  }
  //#endregion
  //#region calculate
  onCalculation(qty: any, rate: any, disc: any, gst: any, index: any) {
    var sub = parseFloat(qty) * parseFloat(rate);
    var totalrate = parseFloat(qty) * parseFloat(rate);
    var discvalue = ((totalrate * parseFloat(disc)) / 100).toFixed(2);
    var afterdisc = totalrate - parseFloat(discvalue);
    var gstvalue = ((afterdisc * parseFloat(gst)) / 100).toFixed(2);
    var net = afterdisc + parseFloat(gstvalue);
    this.listData.filteredData[index].subtotal = sub.toFixed(2);
    this.listData.filteredData[index].taxable = afterdisc.toFixed(2);
    this.listData.filteredData[index].amount = net.toFixed(2);
    this.listData.filteredData[index].gstvalue = gstvalue;
    this.listData.filteredData[index].discvalue = discvalue;
    this.listData._updateChangeSubscription();
    this.calculate();
  }
  totQty: any = 0;
  totQtyMT: any = 0;
  totSub: any = 0;
  totTax: any = 0;
  totAmt: any = 0;
  totTaxValue: any = 0;
  getTotal() {
    this.totQty = 0;
    this.totQtyMT = 0;
    this.totSub = 0;
    this.totTax = 0;
    this.totTaxValue = 0;
    this.totAmt = 0;
    for (let i = 0; i < this.listData.filteredData.length; i++) {
      this.totQty = this.totQty + parseFloat(this.listData.filteredData[i].qty);
      // this.totQtyMT = this.totQtyMT + parseFloat(this.listData.filteredData[i].qtymt);
      this.totSub =
        this.totSub + parseFloat(this.listData.filteredData[i].subtotal);
      this.totTax =
        this.totTax + parseFloat(this.listData.filteredData[i].taxable);
      this.totTaxValue =
        this.totTaxValue + parseFloat(this.listData.filteredData[i].gstvalue);
      this.totAmt =
        this.totAmt + parseFloat(this.listData.filteredData[i].amount);
    }
    this.totQty = this.totQty.toFixed(2);
    this.totQtyMT = this.totQtyMT.toFixed(2);
    this.totSub = this.totSub.toFixed(2);
    this.totTax = this.totTax.toFixed(2);
    this.totTaxValue = this.totTaxValue.toFixed(2);
    this.totAmt = this.totAmt.toFixed(2);
  }
  //#endregion
  //#region Lastrow Second Col
  //#region variables
  subtotal: any = 0.0;
  additionalCharge: any = 0.0;
  disctotal: any = 0.0;
  filteredDef: any[] = [];
  defaultAccounts: Acc[] = [];
  nettotal: any = 0.0;
  tcsvalue: any = 0;
  remarks: any;
  termsandcondition: any;
  closingtotal: any = 0.0;
  //#endregion
  //#region gstlist
  loadDefalutAccounts() {
    this.grnapi.getDefaultAccounts().subscribe((res) => {
      this.defaultAccounts = JSON.parse(res);
      this.filteredDef = this.defaultAccounts;
    });
  }
  filterDefAccounts(event: any) {
    let name = event.target.value;
    this.filteredDef = name
      ? this.defaultAccounts.filter((accs) =>
          accs.ledgername.toLowerCase().includes(name.toLowerCase())
        )
      : this.defaultAccounts;
  }
  gstaccChanged(event: any, data: any, rowindex: any) {
    //console.log("h11",rowindex);
    if (event.isUserInput == true) {
      this.gstlistData.filteredData[rowindex].acccode = data.ledgercode;
    }
  }
  gstInputChanged(event: any, i: any) {
    var amount = event.target.value;
    var gst = this.gstlistData.filteredData[i].accgst;
    if (gst != 'NO GST' && gst != '') {
      var gst = this.gstlistData.filteredData[i].accgst;
      if (amount == '' || amount == undefined) {
        amount = 0;
      }
      if (gst == '' || gst == undefined) {
        gst = 0;
      }
      var gstvalue = (parseFloat(amount) * parseFloat(gst)) / 100;
      this.gstlistData.filteredData[i].accgstvalue = gstvalue;
      this.gstlistData.filteredData[i].accgsttotvalue =
        parseFloat(amount) + gstvalue;
    } else {
      var amount = this.gstlistData.filteredData[i].accvalue;
      this.gstlistData.filteredData[i].accgstvalue = 0;
      this.gstlistData.filteredData[i].accgsttotvalue = parseFloat(amount)
        ? parseFloat(amount)
        : 0;
    }
    this.calculate();
  }
  gstDDChanged(event: any, i: any, r: any) {
    if (event.isUserInput == true) {
      if (event.source.value) {
        var val = event.source.value;
        if (val != 'NO GST' && val != '') {
          var amount = this.gstlistData.filteredData[i].accvalue;
          amount = parseFloat(amount) ? parseFloat(amount) : 0;
          var gstvalue = (parseFloat(amount) * parseFloat(val)) / 100;
          this.gstlistData.filteredData[i].accgstvalue = gstvalue;
          this.gstlistData.filteredData[i].hsn = r.hsn;
          this.gstlistData.filteredData[i].accgsttotvalue =
            parseFloat(amount) + gstvalue;
          this.calculate();
        } else {
          var amount = this.gstlistData.filteredData[i].accvalue;
          amount = parseFloat(amount) ? parseFloat(amount) : 0;
          this.gstlistData.filteredData[i].accgstvalue = 0;
          this.gstlistData.filteredData[i].accgsttotvalue = parseFloat(amount);
          this.calculate();
        }
      }
      this.calculate();
    }
  }
  //#endregion
  //#endregion
  //#region  calculate

  array: gst[] = [];
  loadgst() {
    this.grnapi.getGstAccounts().subscribe((res) => {
      this.array = res;

      // console.log('array',this.array);
    });
  }
  tdsper: any;
  subwithoutcharges: any;

  chk: any = true;
  roundmethod: any = 'AUTO';
  callRoundFunctions(event: any) {
    if (event == true) {
      this.roundmethod = 'AUTO';
      this.calculate();
    } else {
      this.roundmethod = 'MANUAL';
      this.roundedoff = '0';
      this.calculate();
    }
    console.log(this.roundmethod);
  }
  calculate() {
    this.accremoveAll();
    //#region variables
    this.subtotal = 0.0;
    this.additionalCharge = 0.0;
    this.disctotal = 0.0;
    this.nettotal = 0.0;
    var gstAmount = 0.0;

    var prevSGST = 0.0;
    var prevCGST = 0.0;
    var prevIGST = 0.0;
    //#endregion

    // console.log('array', this.vendorstatecode);
    if (this.tdsper == undefined || this.tdsper == '') {
      this.tdsper = 0.0;
    }
    if (this.roundedoff == undefined || this.roundedoff == '') {
      this.roundedoff = 0.0;
    }

    for (let i = 0; i < this.listData.filteredData.length; i++) {
      var sub = isNaN(parseFloat(this.subtotal))
        ? 0
        : parseFloat(this.subtotal);
      var listsub = isNaN(parseFloat(this.listData.filteredData[i].subtotal))
        ? 0
        : parseFloat(this.listData.filteredData[i].subtotal);
      this.subtotal = sub + listsub;
      var dis = isNaN(parseFloat(this.disctotal))
        ? 0
        : parseFloat(this.disctotal);
      var dislist = isNaN(parseFloat(this.listData.filteredData[i].discvalue))
        ? 0
        : parseFloat(this.listData.filteredData[i].discvalue);
      this.disctotal = dis + dislist;

      //GST
      if (this.vendorstatecode == '33') {
        var __gst = this.listData.filteredData[i].gst;
        var __gstvalue = this.listData.filteredData[i].gstvalue;
        var _cgst = parseFloat(__gst) / 2;
        var _sgst = parseFloat(__gst) / 2;
        var _cgstvalue = parseFloat(__gstvalue) / 2;
        var _sgstvalue = parseFloat(__gstvalue) / 2;

        var _gsttype = 'INPUT';
        var _state = 'STATE';
        var _central = 'CENTRAL';

        //For State Tax
        var fasgst = this.array.find(
          (o: any) =>
            o.gsttype == _gsttype && o.taxtype == _state && o.gstper == _sgst
        );
        //Ledger code, ledger Name, gst Value, KEY
        this.addAccDataRow(
          fasgst?.ledgercode,
          _gsttype + ' SGST @ ' + _sgst,
          0,
          _state
        );
        //GET Previous Value
        prevSGST = parseFloat(
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find(
                (o) => o.acccode === fasgst?.ledgercode
              )
            )
          ].accvalue
        );
        //SET Previous SGST Value
        this.acclistData.filteredData[
          this.acclistData.filteredData.indexOf(
            this.acclistData.filteredData.find(
              (o) => o.acccode === fasgst?.ledgercode
            )
          )
        ].accvalue = prevSGST + _sgstvalue;

        //For Central Tax
        var facgst = this.array.find(
          (o: any) =>
            o.gsttype == _gsttype && o.taxtype == _central && o.gstper == _cgst
        );
        //Ledger code, ledger Name, gst Value, KEY
        this.addAccDataRow(
          facgst?.ledgercode,
          _gsttype + ' CGST @ ' + _cgst,
          0,
          _central
        );

        //GET Previous CGST Value
        prevCGST = parseFloat(
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find(
                (o) => o.acccode === facgst?.ledgercode
              )
            )
          ].accvalue
        );

        //SET Previous SGST Value
        this.acclistData.filteredData[
          this.acclistData.filteredData.indexOf(
            this.acclistData.filteredData.find(
              (o) => o.acccode === facgst?.ledgercode
            )
          )
        ].accvalue = prevCGST + _cgstvalue;
      } else if (this.vendorstatecode != '33') {
        var _igst = this.listData.filteredData[i].gst;
        var _igstvalue = this.listData.filteredData[i].gstvalue;

        var _gsttype = 'INPUT';
        var _integrated = 'INTEGRATED';

        //For State Tax
        var faigst = this.array.find(
          (o: any) =>
            o.gsttype == _gsttype &&
            o.taxtype == _integrated &&
            o.gstper == _igst
        );
        //Ledger code, ledger Name, gst Value, KEY
        this.addAccDataRow(
          faigst?.ledgercode,
          _gsttype + ' IGST @ ' + _igst,
          0,
          _integrated
        );

        //GET Previous IGST Value
        prevIGST = parseFloat(
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find(
                (o) => o.acccode === faigst?.ledgercode
              )
            )
          ].accvalue
        );

        //SET Previous IGST Value
        this.acclistData.filteredData[
          this.acclistData.filteredData.indexOf(
            this.acclistData.filteredData.find(
              (o) => o.acccode === faigst?.ledgercode
            )
          )
        ].accvalue = prevIGST + parseFloat(_igstvalue);
      }
      gstAmount =
        gstAmount + parseFloat(this.listData.filteredData[i].gstvalue);
    }

    //Additional
    for (let i = 0; i < this.gstlistData.filteredData.length; i++) {
      if (this.vendorstatecode == '33') {
        var __gst = this.gstlistData.filteredData[i].accgst;
        var __gstvalue = this.gstlistData.filteredData[i].accgstvalue;
        var __gst = isNaN(parseFloat(__gst)) ? '0' : __gst;

        var _cgst = parseFloat(__gst) / 2;
        var _sgst = parseFloat(__gst) / 2;
        var _cgstvalue = parseFloat(__gstvalue) / 2;
        var _sgstvalue = parseFloat(__gstvalue) / 2;

        var _gsttype = 'INPUT';
        var _state = 'STATE';
        var _central = 'CENTRAL';

        //For State Tax
        var fasgst = this.array.find(
          (o: any) =>
            o.gsttype == _gsttype && o.taxtype == _state && o.gstper == _sgst
        );
        //Ledger code, ledger Name, gst Value, KEY
        this.addAccDataRow(
          fasgst?.ledgercode,
          _gsttype + ' SGST @ ' + _sgst,
          0,
          _state
        );
        //GET Previous Value
        prevSGST = parseFloat(
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find(
                (o) => o.acccode === fasgst?.ledgercode
              )
            )
          ].accvalue
        );
        //SET Previous SGST Value
        this.acclistData.filteredData[
          this.acclistData.filteredData.indexOf(
            this.acclistData.filteredData.find(
              (o) => o.acccode === fasgst?.ledgercode
            )
          )
        ].accvalue = prevSGST + _sgstvalue;

        //For Central Tax
        var facgst = this.array.find(
          (o: any) =>
            o.gsttype == _gsttype && o.taxtype == _central && o.gstper == _cgst
        );
        //Ledger code, ledger Name, gst Value, KEY
        this.addAccDataRow(
          facgst?.ledgercode,
          _gsttype + ' CGST @ ' + _cgst,
          0,
          _central
        );

        //GET Previous CGST Value
        prevCGST = parseFloat(
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find(
                (o) => o.acccode === facgst?.ledgercode
              )
            )
          ].accvalue
        );

        //SET Previous SGST Value
        this.acclistData.filteredData[
          this.acclistData.filteredData.indexOf(
            this.acclistData.filteredData.find(
              (o) => o.acccode === facgst?.ledgercode
            )
          )
        ].accvalue = prevSGST + _cgstvalue;
      } else if (this.vendorstatecode != '33') {
        var __gst = this.gstlistData.filteredData[i].accgst;
        var __gstvalue = this.gstlistData.filteredData[i].accgstvalue;
        _igstvalue = parseFloat(__gstvalue);
        var __gst = isNaN(parseFloat(__gst)) ? '0' : __gst;

        var _gsttype = 'INPUT';
        var _integrated = 'INTEGRATED';

        //For State Tax
        var faigst = this.array.find(
          (o: any) =>
            o.gsttype == _gsttype &&
            o.taxtype == _integrated &&
            o.gstper == _igst
        );
        //Ledger code, ledger Name, gst Value, KEY
        this.addAccDataRow(
          faigst?.ledgercode,
          _gsttype + ' IGST @ ' + _igst,
          0,
          _integrated
        );

        //GET Previous IGST Value
        prevSGST = parseFloat(
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find(
                (o) => o.acccode === faigst?.ledgercode
              )
            )
          ].accvalue
        );

        //SET Previous IGST Value
        this.acclistData.filteredData[
          this.acclistData.filteredData.indexOf(
            this.acclistData.filteredData.find(
              (o) => o.acccode === faigst?.ledgercode
            )
          )
        ].accvalue = prevSGST + _igstvalue;
      }
      gstAmount =
        gstAmount + parseFloat(this.gstlistData.filteredData[i].accgstvalue);
    }

    //Addtional Charge
    for (let i = 0; i < this.gstlistData.filteredData.length; i++) {
      let val = this.gstlistData.filteredData[i].accvalue;
      if (val == '' || val == undefined) {
        val = '0';
      }
      this.additionalCharge = this.additionalCharge + parseFloat(val);
    }

    if (this.vendorstatecode == '33') {
      this.cgsttotal = (gstAmount / 2).toFixed(2);
      this.sgsttotal = (gstAmount / 2).toFixed(2);
      this.igsttotal = 0.0;
    } else {
      this.cgsttotal = 0.0;
      this.sgsttotal = 0.0;
      this.igsttotal = gstAmount;
    }
    if (this.subtotal == '' || this.subtotal == undefined) {
      this.subtotal = '0';
    }
    if (this.additionalCharge == '' || this.additionalCharge == undefined) {
      this.additionalCharge = '0';
    }
    if (this.disctotal == '' || this.disctotal == undefined) {
      this.disctotal = '0';
    }
    if (gstAmount == undefined || gstAmount == null || isNaN(gstAmount)) {
      gstAmount = 0;
    }

    this.nettotal =
      parseFloat(this.subtotal) +
      parseFloat(this.additionalCharge) -
      parseFloat(this.disctotal) +
      gstAmount;
    if (
      this.nettotal == '' ||
      this.nettotal == undefined ||
      isNaN(this.nettotal)
    ) {
      this.nettotal = '0';
    }
    if (
      this.tcsrate == '' ||
      this.tcsrate == undefined ||
      isNaN(this.tcsrate)
    ) {
      this.tcsrate = '0';
    }
    if (
      this.tcsvalue == '' ||
      this.tcsvalue == undefined ||
      isNaN(this.tcsvalue)
    ) {
      this.tcsvalue = '0';
    }
    //TCS Process
    if (parseFloat(this.tcsrate) > 0) {
      var tcsAmout = (
        (parseFloat(this.nettotal) * parseFloat(this.tcsrate)) /
        100
      ).toFixed(2);
      this.closingtotal = parseFloat(this.nettotal) + parseFloat(tcsAmout);
      this.tcsvalue = parseFloat(tcsAmout);
    } else {
      this.tcsvalue = 0;
      this.closingtotal = parseFloat(this.nettotal) + parseFloat(this.tcsvalue);
      var per = (
        (parseFloat(this.tcsvalue) / parseFloat(this.nettotal)) *
        100
      ).toFixed();
      if (per == '' || isNaN(parseFloat(per))) {
        per = '0';
      }
      this.tcsrate = per;
    }
    //Round off
    if (this.roundmethod == 'AUTO') {
      var rounded = Math.round(parseFloat(this.closingtotal));
      var roundedvalue = rounded - parseFloat(this.closingtotal);
      this.roundedoff = roundedvalue.toFixed(2);
      this.closingtotal = rounded.toFixed(2);
    } else {
      this.closingtotal = (
        parseFloat(this.closingtotal) + parseFloat(this.roundedoff)
      ).toFixed(2);
    }

    //Removing Zero Values
    this.acclistData.data.forEach((e, index) => {
      if (parseFloat(e.accvalue) == 0) {
        console.log('Zero find', index);
        this.acclistData.data.splice(index);
        this.acclistData.data = [...this.acclistData.data]; // new ref!
        of(this.ACC_DATA).subscribe(
          (data: iaccounts[]) => {
            this.acclistData = new MatTableDataSource(data);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });

    // var find = this.acclistData.data.filter((e:any)=> e.accvalue!=0);
    // this.acclistData = new MatTableDataSource(find);
    // console.log(this.acclistData.filteredData);
    // console.log(this.listData.filteredData);
    // console.log(this.gstlistData.filteredData);
  }

  //#endregion
  //#region methods
  //#region  navigation
  moveFocus(nextInput: HTMLInputElement | HTMLTextAreaElement): void {
    nextInput.focus();
  }
  Empty(event: any) {
    if (event.target.value == 0) {
      event.target.value = '';
    }
  }
  return(event: any) {
    if (event.target.value == '') {
      event.target.value = 0;
    }
  }

  //#endregion
  gotolist() {
    this.router.navigateByUrl('purchase-order-list');
    this.viewportScroller.scrollToPosition([0, 0]);
  }
  getGUID() {
    var gid: any;
    gid = Guid.create();
    return gid.value;
  }
  vchType = 'PO';
  _company = '001';
  _branch = '001';
  _fy = '001';
  _fyname = '23-24';
  ponoid: any;
  getMaxPoNo() {
    return new Promise((resolve) => {
      this.poapi
        .getMaxInvoiceNo(this.vchType, this._branch, this._fy, this._fyname)
        .subscribe((res) => {
          this.pono = res.invNo;
          this.ponoid = res.invNoId;
          resolve({ action: 'success' });
        });
    });
  }
  //#endregion
  //#region submit
  submit() {
    this.calculate();
    setTimeout(() => {
      var res = this.validate();
      if (res == true) {
        if (this.formGRN.valid) {
          this.loading = true;
          this.getMaxPoNo().then((res) => {
            this.insertCustomFields().then((res) => {
              this.insertGrnDetails().then((res) => {
                this.insertGrn().then((res) => {
                  this.showSuccessMsg();
                });
              });
            });
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Fill Mandatory Fields',
            text: 'Plese fill all mandatory fields',
          });
          this.loading = false;
        }
      }
    }, 100);
  }
  //#endregion
  //#region validate
  validate() {
    if (this.dataSource.length > 0) {
      var val = this.nettotal;
      if (parseFloat(val) > 0) {
        return true;
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Plase Add Products',
          text: 'No Products Added or Values not Specified!',
        });
        return false;
      }
    } else {
      return true;
    }
  }
  //#endregion
  //#region showsuccess msg
  showSuccessMsg() {
    let dialogRef = this.dialog.open(SuccessmsgComponent, {
      width: '350px',
      data: 'Voucher Successfully Saved!',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.clear();
      this.loading = false;
    });
  }
  //#endregion
  //#region clear
  //#region variables
  vendordiv = false;
  subinvno: any;
  subinvdate: any;
  expdelidate: any;
  paymentTerm: any;
  pkRate: any = 0;
  pkValue: any = 0.0;
  tpRate: any = 0;
  tpValue: any = 0.0;
  insRate: any = 0;
  insValue: any = 0.0;
  //#endregion
  clear() {
    this.cusFields = [];
    this.ledger = [];
    this.termsandcondition = '';
    this.getMaxPoNo();
    this.podate = undefined;
    this.pono = undefined;
    this.vendordiv = false;
    this.selectedvendor = '';
    this.vendorcode = '';
    this.vendorname = '';
    this.vendorgstno = '';
    this.vendorbilling = '';
    this.vendorgstTreatment = '';
    this.vendorstate = '';
    this.vendorstatecode = '';
    this.subinvno = '';
    this.subinvdate = undefined;
    this.expdelidate = undefined;
    this.paymentTerm = '';
    this.refno = '';
    this.remarks = '';
    this.roundedoff = '0';
    this.pkRate = 0;
    this.pkValue = 0;
    this.tpRate = 0;
    this.tpValue = 0;
    this.insRate = 0;
    this, (this.insValue = 0);
    this.tcsrate = 0;
    this.tcsvalue = 0;
    this.loadpdef();
    this.removeAll();
    this.calculate();
  }
  //#endregion
  //#region insert
  //#region insertcustom Fields

  cusFields: Cus[] = [];
  insertCustomFields() {
    return new Promise((resolve) => {
      for (let i = 0; i < this.sdef.length; i++) {
        var postdata = {
          id: this.getGUID(),
          efieldname: this.sdef[i].efieldname,
          efieldvalue: this.sdef[i].efieldvalue,
          pono: this.pono.toString(),
          potype: this.vchType,
          RCreatedDateTime: new Date(),
          RStatus: 'A',
          company: this._company,
          branch: this._branch,
          fy: this._fy,
        };
        if (this.sdef[i].efieldvalue != '') {
          this.cusFields.push(postdata);
        }
      }
      this.poapi.insertCusFields(this.cusFields).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }
  //#endregion
  insertGrnDetails() {
    return new Promise((resolve) => {
      this.dataSource.forEach((element) => {
        (element.pono = this.pono.toString()),
          (element.podate = this.podate),
          (element.id = this.getGUID()),
          (element.company = this._company),
          (element.branch = this._branch),
          (element.fy = this._fy),
          (element.vendorcode = this.vendorcode.toString()),
          (element.potype = this.vchType);
      });
      this.dataSource.forEach((element, index) => {
        var amount = element.amount;
        if (amount === 0) {
          this.dataSource.splice(index, 1);
        }
      });
      this.poapi.Insert_Bulk_PO_Details(this.dataSource).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }
  cgsttotal: any = 0.0;
  sgsttotal: any = 0.0;
  igsttotal: any = 0.0;
  invoicecopy: any;
  insertGrn() {
    return new Promise((resolve) => {
      var postData = {
        id: this.getGUID(),
        pono: this.pono,
        ponoid: this.ponoid,
        podate: this.podate,
        company: this._company,
        branch: this._branch,
        fy: this._fy,
        refno: this.refno,
        vendorcode: this.vendorcode.toString(),
        vendorname: this.vendorname,
        expDeliveryDate: this.expdelidate,
        payTerm: this.paymentTerm,
        remarks: this.remarks,
        invoicecopy: this.invoicecopy,
        subTotal: isNaN(parseFloat(this.subtotal))
          ? 0
          : parseFloat(this.subtotal),
        discountTotal: isNaN(parseFloat(this.disctotal))
          ? 0
          : parseFloat(this.disctotal),
        cgstTotal: isNaN(parseFloat(this.cgsttotal))
          ? 0
          : parseFloat(this.cgsttotal),
        sgstTotal: isNaN(parseFloat(this.sgsttotal))
          ? 0
          : parseFloat(this.sgsttotal),
        igstTotal: isNaN(parseFloat(this.igsttotal))
          ? 0
          : parseFloat(this.igsttotal),
        roundedoff: isNaN(parseFloat(this.roundedoff))
          ? 0
          : parseFloat(this.roundedoff),
        net: isNaN(parseFloat(this.nettotal)) ? 0 : parseFloat(this.nettotal),
        trRate: isNaN(parseFloat(this.tpRate)) ? 0 : parseFloat(this.tpRate),
        trValue: isNaN(parseFloat(this.tpValue)) ? 0 : parseFloat(this.tpValue),
        pkRate: isNaN(parseFloat(this.pkRate)) ? 0 : parseFloat(this.pkRate),
        pkValue: isNaN(parseFloat(this.pkValue)) ? 0 : parseFloat(this.pkValue),
        inRate: isNaN(parseFloat(this.insRate)) ? 0 : parseFloat(this.insRate),
        inValue: isNaN(parseFloat(this.insValue))
          ? 0
          : parseFloat(this.insValue),
        tcsRate: isNaN(parseFloat(this.tcsrate)) ? 0 : parseFloat(this.tcsrate),
        tcsValue: isNaN(parseFloat(this.tcsvalue))
          ? 0
          : parseFloat(this.tcsvalue),
        potype: this.vchType,
        termsandcondition: this.termsandcondition,
        rCreatedDateTime: new Date(),
        rStatus: 'A',
      };
      this.poapi.Insert_PO(postData).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }
  ledger: Ledger[] = [];

  forMoney(event: KeyboardEvent) {
    const keyCode = event.which ? event.which : event.keyCode;
    const isValidKey = keyCode >= 48 && keyCode <= 57;
    const isValidDecimal = keyCode === 46;
    const isValidInput = isValidKey || isValidDecimal;

    if (!isValidInput) {
      event.preventDefault();
    }
  }
  prevent(event: KeyboardEvent) {
    event.preventDefault();
  }
  forMoneyCal(event: KeyboardEvent) {
    const keyCode = event.which ? event.which : event.keyCode;
    const isValidKey = keyCode >= 48 && keyCode <= 57; // 0-9
    const isValidDecimal = keyCode === 46; // decimal point
    const isValidOperator = [43, 45].includes(keyCode); // +, -, *, %, /

    const isValidInput = isValidKey || isValidDecimal || isValidOperator;

    if (!isValidInput) {
      event.preventDefault();
    }
  }
  //#endregion

  getPayTerm(event: any) {
    if (event.isUserInput == true) {
      this.paymentTerm = event.source.triggerValue;
      // console.log(this.paymentTerm)
    }
  }

  calculateAddChargeGST(event: any, i: any) {
    var amount = event.target.value;
    var gst = this.gstlistData.filteredData[i].accgst;
    if (amount == '' || amount == undefined) {
      amount = 0;
    }
    if (gst == '' || gst == undefined) {
      gst = 0;
    }
    if (gst != 'NO GST' && gst != '') {
      var gstvalue = (parseFloat(amount) * parseFloat(gst)) / 100;
      this.gstlistData.filteredData[i].accgstvalue = gstvalue;
      this.gstlistData.filteredData[i].accgsttotvalue =
        parseFloat(amount) + gstvalue;
    } else {
      var amount = this.gstlistData.filteredData[i].accvalue;
      this.gstlistData.filteredData[i].accgstvalue = 0;
      this.gstlistData.filteredData[i].accgsttotvalue = parseFloat(
        amount
      ).toFixed(2)
        ? parseFloat(amount)
        : 0;
    }
    this.calculate();
  }
  calculateAddChargeGST_DDChanged(event: any, i: any, r: any) {
    if (event.isUserInput == true) {
      if (event.source.value) {
        var val = event.source.value;
        if (val != 'NO GST' && val != '') {
          var amount = this.gstlistData.filteredData[i].accvalue;
          amount = parseFloat(amount) ? parseFloat(amount) : 0;
          var gstvalue = (parseFloat(amount) * parseFloat(val)) / 100;
          this.gstlistData.filteredData[i].accgstvalue = gstvalue;
          this.gstlistData.filteredData[i].hsn = r.hsn;
          this.gstlistData.filteredData[i].accgsttotvalue =
            parseFloat(amount) + gstvalue;
          this.calculate();
        } else {
          var amount = this.gstlistData.filteredData[i].accvalue;
          amount = parseFloat(amount) ? parseFloat(amount) : 0;
          this.gstlistData.filteredData[i].accgstvalue = 0;
          this.gstlistData.filteredData[i].accgsttotvalue =
            parseFloat(amount).toFixed(2);
          this.calculate();
        }
      }
      this.calculate();
    }
  }
  onAddtionalGSTKeydown(event: any, rowindex: any) {
    //this.gstaddRow();
  }
  onAddtionalAmountKeydown(event: any, rowindex: any) {
    this.eAddGstDD.toArray()[rowindex].nativeElement.value = '';
    this.eAddGstDD.toArray()[rowindex].nativeElement.select();
    this.eAddGstDD.toArray()[rowindex].nativeElement.focus();
  }
  onAddtionalDDKeydown(event: any, rowindex: any) {
    console.log(rowindex);
    this.eAddCharge.toArray()[rowindex].nativeElement.value = '';
    this.eAddCharge.toArray()[rowindex].nativeElement.select();
    this.eAddCharge.toArray()[rowindex].nativeElement.focus();
  }
}
