import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { map, Observable, of, startWith } from 'rxjs';

import { SsoService } from 'src/app/services/sso.service';
import Swal from 'sweetalert2';

import { SsalesService } from 'src/app/services/ssales.service';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { GrnService } from 'src/app/services/grn.service';
// import { Ledger, gstdata } from 'src/app/Component/Interface/all-interface';
// import { GstdataService } from 'src/app/services/gstdata.service';
import { ShowdelivaddressComponent } from 'src/app/vouchers/models/showdelivaddress/showdelivaddress.component';
import { AdddelivaddressComponent } from 'src/app/vouchers/models/adddelivaddress/adddelivaddress.component';
import { ApiService } from 'src/app/services/api.service';
import { GstdataService } from 'src/app/services/gstdata.service';
import {
  Ledger,
  gstdata,
} from '../../SalesOrder/SalesOrderTS/SalesOrderInterface';

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
  qtymt: string;
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
@Component({
  selector: 'app-servicesaleupdate',
  templateUrl: './servicesaleupdate.component.html',
  styleUrls: ['./servicesaleupdate.component.scss'],
})
export class ServicesaleupdateComponent implements OnInit {
  form!: FormGroup;
  getGUID() {
    var gid: any;
    gid = Guid.create();
    return gid.value;
  }
  branch: any = '001';
  fy: any = '001';
  company: any = '001';
  fyname: any = '23-24';
  vendoroutstanding: any;
  //#region vendors
  vendorsArray: Vendor[] = [];
  vendorSearch = new FormControl('');
  filteredVendors!: Observable<Vendor[]>;
  vendorpodatacount = 0;
  btnvendorchange: any;
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
  displayedColumns: string[] = [
    'product',
    'qty',
    'rate',
    'subtotal',
    'disc',
    'taxable',
    'gst',
    'amount',
    'select',
  ];
  constructor(
    public router: Router,
    private fb: FormBuilder,
    public salesapi: SsalesService,
    public soapi: SsoService,
    public grnapi: GrnService,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public gstdataapi: GstdataService,
    public api: ApiService
  ) {
    this.form = new FormGroup({
      cinvno: new FormControl(),
      cinvdate: new FormControl(),
      cpono: new FormControl(),
      cpodate: new FormControl(),
      cvchtype: new FormControl(),
      cacntname: new FormControl(),
      vendor: new FormControl(),
      edate: new FormControl(),
      pterms: new FormControl(),
      ref: new FormControl(),
      sref: new FormControl(),
    });
  }

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

  //ViewChilds
  @ViewChild('table') tabledata!: MatTable<Element>;
  @ViewChildren('eprod') private eprod!: QueryList<ElementRef>;
  @ViewChildren('esku') private esku!: QueryList<ElementRef>;
  @ViewChildren('ehsn') private ehsn!: QueryList<ElementRef>;
  @ViewChildren('egodown') private egodown!: QueryList<ElementRef>;
  @ViewChildren('eqty') private eqty!: QueryList<ElementRef>;
  @ViewChildren('eqtymt') private eqtymt!: QueryList<ElementRef>;
  @ViewChildren('erate') private erate!: QueryList<ElementRef>;
  @ViewChildren('etransport') private etransport!: QueryList<ElementRef>;
  @ViewChildren('epacking') private epacking!: QueryList<ElementRef>;
  @ViewChildren('edisc') private edisc!: QueryList<ElementRef>;
  @ViewChildren('ediscvalue') private ediscvalue!: QueryList<ElementRef>;
  @ViewChildren('etax') private etax!: QueryList<ElementRef>;
  @ViewChildren('etaxvalue') private etaxvalue!: QueryList<ElementRef>;
  @ViewChildren('eamt') private eamt!: QueryList<ElementRef>;
  //Venndors
  @ViewChild('evendorname') evendorname: ElementRef | undefined;
  @ViewChild('epodate') epodate: ElementRef | undefined;
  @ViewChild('erefname') erefname: ElementRef | undefined;
  @ViewChildren('eAddCharge') private eAddCharge!: QueryList<ElementRef>;
  @ViewChildren('eAddGstDD') private eAddGstDD!: QueryList<ElementRef>;

  ngOnInit(): void {
    this.emptyrowonload();
    this.setvalidation();

    this.loadSavedAccounts().then(() => {
      this.loadSalesAccounts().then(() => {
        this.loadCustomers().then(() => {
          this.loadSaleRef().then(() => {
            this.loadProducts().then(() => {
              this.loadDefalutAccounts().then(() => {
                this.loadgst().then(() => {
                  this.loadsdef().then(() => {
                    var id = this.activatedRoute.snapshot.paramMap.get('id');
                    if (id !== null) {
                      this.invno = decodeURIComponent(id).trim();
                      this.loadPreviousBills();
                    }
                  });
                });
              });
            });
          });
        });
      });
    });
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
  }

  loadPreviousBills() {
    this.vchtype = 'Service Sale';
    this.loadSavedSdef();
    this.loadSODetails().then((res) => {
      this.loadLedger().then((res) => {
        this.loadSO().then((res) => {
          this.calculate();
        });
      });
    });
  }

  loadgst() {
    return new Promise((resolve, reject) => {
      this.soapi.getGstAccounts().subscribe((res) => {
        this.array = res;
        resolve({ action: 'success' });
        // console.log(this.array);
      });
    });
  }

  loadSavedAccounts() {
    return new Promise((resolve) => {
      this.salesapi.getSavedAccounts().subscribe((res) => {
        this.salesDiscountAcc = res[0].discAcc;
        this.transportAcc = res[0].tranAcc;
        this.packingAcc = res[0].packAcc;
        this.insurenceAcc = res[0].insuAcc;
        this.tcsAcc = res[0].tcsAcc;
        this.roundingAcc = res[0].rounding;
      });
      resolve({ action: 'success' });
    });
  }

  loadDefalutAccounts() {
    return new Promise((resolve, reject) => {
      this.soapi.getDefaultAccounts().subscribe((res) => {
        this.defaultAccounts = JSON.parse(res);
        this.filteredDef = this.defaultAccounts;
        resolve({ action: 'success' });
      });
    });
  }

  name: any;
  loadLedger() {
    return new Promise((resolve) => {
      this.emptyGstGrid();
      this.grnapi.get_Ledger(this.invno.toString()).subscribe((res) => {
        for (var i = 0; i < res.length; i++) {
          if (res[i].ad === 'Add') {
            for (var j = 0; j < this.defaultAccounts.length; j++) {
              if (res[i].acccode == this.defaultAccounts[j].ledgercode) {
                this.name = this.defaultAccounts[j].ledgername;
              }
            }
            var gstvalue = isNaN(parseFloat(res[i].gst))
              ? 0
              : parseFloat(res[i].gst);
            var gst = isNaN(parseFloat(res[i].gst))
              ? 0
              : parseFloat(res[i].gst);
            var cal = (parseFloat(res[i].dr) * gst) / 100;
            var totalgst = cal + parseFloat(res[i].cr);
            const newrow = {
              acccode: res[i].acccode,
              accname: this.name,
              accvalue: res[i].cr,
              accgst: res[i].gst,
              accgstvalue: gstvalue.toString(),
              accgsttotvalue: totalgst.toString(),
              hsn: res[i].hsn,
            };
            this.GST_DATA.push(newrow);
            this.findGst();
            this.calculate();
          }
        }
        // this.gstArray.push({ gst: maxGst, hsn: rhsn });
      });
      of(this.GST_DATA).subscribe(
        (data: igstaccounts[]) => {
          this.gstlistData = new MatTableDataSource(data);
        },
        (error) => {
          console.log(error);
        }
      );

      resolve({ action: 'success' });
    });
  }
  emptyGstGrid() {
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
  sdefload: any;
  loadSavedSdef() {
    this.salesapi.getSavedDefSalesFields(this.invno).subscribe((res) => {
      this.sdefload = JSON.parse(res);
      if (this.sdefload.length == 0) {
        this.loadsdef().then((res) => {
          this.updateSdef();
        });
      } else {
        this.updateSdef();
      }
    });
  }
  updateSdef() {
    for (var i = 0; i < this.sdefload.length; i++) {
      for (var j = 0; j < this.sdef.length; j++) {
        if (
          this.sdefload[i].efieldname == this.sdef[j].efieldname &&
          this.sdefload[i].efieldvalue != this.sdef[j].efieldvalue
        ) {
          this.sdef[j] = this.sdefload[i];
        }
      }
    }
  }
  loadSODetails() {
    return new Promise((resolve) => {
      this.emprtyGrid();
      this.salesapi.get_SalesDetails(this.invno).subscribe((res) => {
        res.forEach((v: any) => {
          this.addDataRow(
            v.productcode,
            v.product,
            v.sku,
            v.hsn,
            v.godown,
            v.qty,
            v.rate,
            v.disc,
            v.gst
          );
        });
        this.textBoxCalculation();
      });
      resolve({ action: 'success' });
    });
  }
  emprtyGrid() {
    this.listData.data.splice(0, this.listData.data.length);
    this.listData.data = [...this.listData.data]; // new ref!
    of(this.ELEMENT_DATA).subscribe(
      (data: iprodutcs[]) => {
        this.listData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  textBoxCalculation() {
    for (let i = 0; i < this.listData.filteredData.length; i++) {
      var qty = this.listData.filteredData[i].qty;
      var rate = this.listData.filteredData[i].rate;
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      this.onCalculation(qty, rate, disc, gst, i);
    }
    this.calculate();
  }
  addDataRow(
    pcode: any,
    pname: any,
    sku: any,
    hsn: any,
    godown: any,
    qty: any,
    rate: any,
    disc: any,
    tax: any
  ) {
    return new Promise((resolve) => {
      const newRow = {
        id: this.getGUID(),
        invno: '1',
        invdate: this.invdate,
        product: pname,
        productcode: pcode,
        sku: sku,
        hsn: hsn,
        godown: godown,
        qty: qty,
        qtymt: '',
        uom: '',
        rate: rate,
        transport: 0,
        packing: 0,
        insurence: 0,
        subtotal: 0,
        disc: disc,
        discvalue: 0,
        taxable: 0,
        gst: tax,
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
      };
      this.ELEMENT_DATA.push(newRow);
      of(this.ELEMENT_DATA).subscribe(
        (data: iprodutcs[]) => {
          this.listData = new MatTableDataSource(data);
        },
        (error) => {
          // console.log(error);
        }
      );
      resolve({ action: 'success' });
    });
  }

  loadSO() {
    return new Promise((resolve) => {
      this.salesapi.get_Sales(this.invno.toString()).subscribe((res) => {
        // console.log('po', res);
        this.pono = res[0].sono;
        this.podate = res[0].sodate;
        this.expdelidate = res[0].expDeliveryDate;
        this.refno = res[0].refno;
        this.vendorcode = res[0].customercode;
        this.vendorname = res[0].customername;
        this.remarks = res[0].remarks;
        this.termsandcondition = res[0].termsandcondition;
        this.roundedoff = res[0].roundedoff;
        // this.tpRate = res[0].trRate;
        // this.pkRate = res[0].pkRate;
        // this.insRate = res[0].inRate;
        this.tcsrate = res[0].tcsRate;
        this.salerefname = res[0].salerefname;
        this.vendordelivery = res[0].deliveryaddress;
        this.expdelidate = res[0].expDeliveryDate;
        this.refno = res[0].ref;
        this.vendorcode = res[0].customercode;
        this.vendorname = res[0].customername;
        this.remarks = res[0].remarks;
        this.roundedoff = res[0].roundedoff;
        // this.subinvno = res[0].vinvno;
        // this.subinvdate = res[0].vinvdate;
        this.expdelidate = res[0].expDeliveryDate;
        this.refno = res[0].refno;
        this.salerefname = res[0].salerefname;
        this.paymentTerm = res[0].payTerm;
        //this.vchtype = res[0].vchtype;
        this.findvendor(this.vendorcode);
        this.findsalesAccount(res[0].saleaccount);
        resolve({ action: 'success' });
      });
    });
  }
  vendors: any = [];
  findvendor(code: any) {
    // console.log("code",code)
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
  findsalesAccount(code: any) {
    return new Promise((resolve) => {
      // console.log("Sales account",code);
      const found = this.accArray.find((obj: any) => {
        return obj.ledgercode === parseInt(code);
      });
      if (found) {
        this.vchaccount = found.ledgername;
        this.vchaccountcode = found.ledgercode;
        resolve({ action: 'success' });
      }
    });
  }

  setvalidation() {
    this.form = this.fb.group({
      cinvno: ['', [Validators.required]],
      cinvdate: ['', [Validators.required]],
      cpono: ['', [Validators.nullValidator]],
      cpodate: ['', [Validators.nullValidator]],
      cvchtype: ['', [Validators.required]],
      cacntname: ['', [Validators.required]],
      vendor: ['', [Validators.required]],
      edate: ['', [Validators.nullValidator]],
      pterms: ['', [Validators.nullValidator]],
      ref: ['', [Validators.nullValidator]],
      sref: ['', [Validators.required]],
    });
  }
  ssid: any;
  getMaxInvoiceNo() {
    return new Promise((resolve) => {
      this.salesapi
        .getMaxInvoiceNo(this.vchtype, this.branch, this.fy, this.fyname)
        .subscribe((res) => {
          this.invno = res.invNo;
          this.ssid = res.invNoId;
          resolve({ action: 'success' });
        });
    });
  }

  loadSalesAccounts() {
    return new Promise((resolve, reject) => {
      this.salesapi.getSalesAccounts().subscribe((res) => {
        this.accArray = JSON.parse(res);
        if (this.accSearch) {
          this.filteredAccounts = this.accSearch.valueChanges.pipe(
            startWith(''),
            map((acc) =>
              acc ? this._filterAccounts(acc) : this.accArray.slice()
            )
          );
        }
        resolve({ action: 'success' });
      });
    });
  }
  private _filterAccounts(value: any): Acc[] {
    const filterValue = value.toLowerCase();
    return this.accArray.filter((acc: any) =>
      acc.ledgername.toLowerCase().includes(filterValue)
    );
  }

  loadProducts() {
    return new Promise((resolve, reject) => {
      this.salesapi.getProducts().subscribe((res) => {
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
        this.prodArray = res;
        resolve({ action: 'success' });
      });
    });
  }

  addemptyrow() {
    of(this.ELEMENT_DATA).subscribe(
      (data: iprodutcs[]) => {
        this.listData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onProdKeydown(event: any, rowindex: any) {
    this.eqty.toArray()[rowindex].nativeElement.value = '';
    this.eqty.toArray()[rowindex].nativeElement.select();
    this.eqty.toArray()[rowindex].nativeElement.focus();
  }

  filterProducts(name: string) {
    return (
      (name &&
        this.prodArray.filter((items: { itemname: string }) =>
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
      this.listData.filteredData[rowindex].gst = data.gst;
      // this.egodown.toArray()[rowindex].nativeElement.value = "";
      // this.egodown.toArray()[rowindex].nativeElement.focus();
    }
  }

  loadsdef() {
    return new Promise((resolve, reject) => {
      this.soapi.getDefSOFields().subscribe((res) => {
        this.sdef = res;
        resolve({ action: 'success' });
      });
    });
  }

  emptyrow() {
    of(this.ACC_DATA).subscribe(
      (data: iaccounts[]) => {
        this.acclistData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
    //Add Empty Line to GST Accounts GRIDks
    of(this.GST_DATA).subscribe(
      (data: igstaccounts[]) => {
        this.gstlistData = new MatTableDataSource(data);
        // console.log(this.gstlistData);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  loadgstwithvalue() {
    for (var i = 0; i < this.gstlistData.data.length; i++) {
      this.gstlistData.filteredData[i].accgst = 'NO GST';
    }
  }

  forMoney(event: KeyboardEvent) {
    const keyCode = event.which ? event.which : event.keyCode;
    const isValidKey = keyCode >= 48 && keyCode <= 57;
    const isValidDecimal = keyCode === 46;
    const isValidInput = isValidKey || isValidDecimal;

    if (!isValidInput) {
      event.preventDefault();
    }
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
  prevent(event: KeyboardEvent) {
    event.preventDefault();
  }
  //#region sales-layout-table
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
      customercode: '',
      sono: '',
      sodate: '',
      vtype: '',
    },
  ];
  listData!: MatTableDataSource<any>;
  prodArray: Product[] = [];
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
  //#region keydown
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
  onRateKeydown(event: any, rowindex: any) {
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
  }
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
  //#endregion
  //#endregion

  //#region sales-layout-end
  sdef: any;
  additionalCharge: any = '0.00';
  subtotal: any = '0.00';
  disctotal: any;
  nettotal: any;
  tdsper: any;
  roundedoff: any;
  array: gst[] = [];
  acclistData!: MatTableDataSource<any>;
  gstlistData!: MatTableDataSource<any>;
  cgsttotal: any;
  sgsttotal: any;
  igsttotal: any;
  tcsrate: any;
  tcsvalue: any;
  closingtotal: any;
  remarks: any;
  termsandcondition: any;
  //#endregion

  filteredDef: any[] = [];
  defaultAccounts: Acc[] = [];
  filterDefAccounts(event: any) {
    let name = event.target.value;
    this.filteredDef = name
      ? this.defaultAccounts.filter((accs) =>
          accs.ledgername.toLowerCase().includes(name.toLowerCase())
        )
      : this.defaultAccounts;
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
        accvalue: '',
        accgst: '',
        accgstvalue: '',
        accgsttotvalue: '',
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
      this.loadgstwithvalue();
      resolve({ action: 'success' });
    });
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

  gstaccChanged(event: any, data: any, rowindex: any) {
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

        var _gsttype = 'OUTPUT';
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

        var _gsttype = 'OUTPUT';
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

        console.log(prevIGST + parseFloat(_igstvalue), 'P V 1');
        console.log(this.acclistData.filteredData, 'P V 2');
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

        var _gsttype = 'OUTPUT';
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
        var __gst = isNaN(parseFloat(__gst)) ? '0' : __gst;

        var _gsttype = 'OUTPUT';
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
      this.closingtotal =
        parseFloat(this.closingtotal) + parseFloat(this.roundedoff);
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

  gotoList() {
    this.router.navigateByUrl('sales-service-list');
  }
  accountChanged(event: any, data: any) {
    if (event.isUserInput == true) {
      this.vchaccountcode = data.ledgercode;
      this.vchaccount = data.ledgername;
    }
  }

  loadCustomers() {
    return new Promise((resolve, reject) => {
      this.salesapi.getCustomers().subscribe((res) => {
        this.vendorsArray = JSON.parse(res);
        this.vendors = JSON.parse(res);
        this.filteredVendors = this.vendorSearch.valueChanges.pipe(
          startWith(''),
          map((vendor) =>
            vendor ? this._filtercustomers(vendor) : this.vendorsArray.slice()
          )
        );
        resolve({ action: 'success' });
      });
    });
  }
  private _filtercustomers(value: any): Vendor[] {
    const filterValue = value.toLowerCase();
    return this.vendorsArray.filter((vendor: any) =>
      vendor.CompanyDisplayName.toLowerCase().includes(filterValue)
    );
  }
  vendorChanged(event: any, data: any) {
    if (event.isUserInput == true) {
      this.salesapi
        .getPendingSOListDetails(data.LedgerCode)
        .subscribe((res) => {
          this.vendorpodatacount = res.length;
          this.vendorpodata = res;
        });
      this.selectedvendor = data;
      this.vendorcode = data.LedgerCode.toString();
      this.vendorname = data.CompanyDisplayName;
      this.vendorgstno = data.GSTNo;
      this.vendorbilling = data.BilingAddress;
      this.vendordelivery = data.DeliveryAddress;
      this.vendorgstTreatment = data.GSTTreatment;
      this.vendorstate = data.StateName;
      this.vendorstatecode = data.stateCode;
      this.calculate();
      // this.initial.calculate();
    }
  }
  getPayTerm(event: any) {
    if (event.isUserInput == true) {
      this.paymentTerm = event.source.triggerValue;
      // console.log(this.paymentTerm)
    }
  }

  loadSaleRef() {
    return new Promise((resolve, reject) => {
      this.soapi.get_SaleRef().subscribe((res) => {
        this.salesRefArray = res;
        // console.log(this.salesRefArray);
        this.filteredSref = this.refSearch.valueChanges.pipe(
          startWith(''),
          map((vendor) =>
            vendor ? this._filterref(vendor) : this.salesRefArray.slice()
          )
        );
        resolve({ action: 'success' });
      });
    });
  }
  private _filterref(value: any): sref[] {
    const filterValue = value.toLowerCase();
    return this.salesRefArray.filter((vendor: any) =>
      vendor.refname.toLowerCase().includes(filterValue)
    );
  }
  changeRef() {
    this.salerefname = '';
  }
  SaleRefChanged(event: any, data: any) {
    this.salerefname = data.refname;
  }
  validate() {
    var c = 0;
    for (let i = 0; i < this.acclistData.filteredData.length; i++) {
      var val = this.acclistData.filteredData[i].acccode.toString();
      if (val == '') {
        c = c + 1;
      }
      if (c > 0) {
        Swal.fire({
          icon: 'info',
          title: 'Taxation Details Not Correct!',
          text: 'Please Refresh and Continue!',
        });
        return false;
      }
    }
    if (this.pono != undefined && this.pono != '') {
      if (this.podate == '' || this.podate == undefined) {
        Swal.fire({
          icon: 'info',
          title: 'SO Date Need!',
          text: 'Please Select SO Date!',
        });
        return false;
      }
    }
    if (this.vchtype == '' || this.vchtype == undefined) {
      Swal.fire({
        icon: 'info',
        title: 'Voucher Type Need!',
        text: 'Please Select Voucher Type!',
      });
      return false;
    }
    if (this.vchaccountcode == '' || this.vchaccountcode == undefined) {
      Swal.fire({
        icon: 'info',
        title: 'Sales Account Need!',
        text: 'Please Select Sales Account!',
      });
      return false;
    }
    if (
      this.salerefname == null ||
      this.salerefname == '' ||
      this.salerefname == ' ' ||
      this.salerefname == undefined
    ) {
      Swal.fire({
        icon: 'info',
        title: 'Plase Select Sales Ref',
        text: 'No Sales Ref not Specified!',
      });
      return false;
    }
    if (parseFloat(this.nettotal) <= 0) {
      Swal.fire({
        icon: 'info',
        title: 'Please Add Products',
        text: 'No Products Added or Values not Specified!',
      });
      return false;
    }

    return true;
  }
  loading: boolean = false;
  submit() {
    this.calculate();
    setTimeout(() => {
      var res = this.validate();
      if (res == true) {
        if (this.form.valid) {
          this.loading = true;
          this.deleteExistingGRN().then(() => {
            this.insertGrn().then(() => {
              this.insertCustomFields().then(() => {
                this.insertGrnDetails().then(() => {
                  this.insertOverDue().then(() => {
                    this.insertGstData().then(() => {
                      this.showSuccessMsg();
                    });
                  });
                });
              });
            });
          });
        }
      }
    }, 100);
  }
  showSuccessMsg() {
    let dialogRef = this.dialog.open(SuccessmsgComponent, {
      //width: '350px',
      data: 'Voucher Successfully Saved!',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loading = false;
      this.clear();
      this.router.navigateByUrl('servicesales');
    });
  }
  clear() {
    this.getMaxInvoiceNo();
    // this.callChildFunction();
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
    this.ledger = [];
    this.cusFields = [];
    this.gstdata = [];
    this.gstArray.splice(0);
    this.gstArray.push({ gst: 'NO GST', hsn: '' });
    this.invdate = new Date();
    this.pono = undefined;
    this.podate = undefined;
    // this.vendordiv = false;
    this.vchaccount = '';
    this.vendorname = '';
    // this.subinvno = '';
    // this.subinvdate = undefined;
    this.expdelidate = undefined;
    this.paymentTerm = '';
    this.refno = '';
    this.remarks = '';
    this.termsandcondition = '';
    this.roundedoff = '0';
    // this.tpRate = '';
    // this.tpValue = '';
    // this.pkRate = '';
    // this.pkValue = '';
    // this.insRate = '';
    // this.insValue = '';
    this.tcsrate = '';
    this.tcsvalue = '';
    this.sdef.efieldvalue = '';
    this.removeAll();
    this.calculate();
    this.loadsdef();
  }

  removeAll() {
    this.listData.data.splice(0, this.listData.data.length);
    this.listData.data = [...this.listData.data]; // new ref!
    of(this.ELEMENT_DATA).subscribe(
      (data: iprodutcs[]) => {
        this.listData = new MatTableDataSource(data);
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

  addRow() {
    return new Promise((resolve) => {
      const newRow = {
        id: this.getGUID(),
        invno: '1',
        invdate: this.invdate,
        product: '',
        productcode: '',
        sku: '',
        hsn: '',
        godown: '',
        qty: 0,
        qtymt: '',
        uom: '',
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
  subinvno: any;
  subinvdate: any;
  tdstotal: any = 0.0;
  invoicecopy: any;
  insertGrn() {
    // console.log('GRN', this.invno);
    return new Promise((resolve) => {
      var postData = {
        id: this.getGUID(),
        invno: this.invno,
        invdate: this.invdate,
        ssid: this.ssid,
        sono: this.pono,
        sodate: this.podate,
        refno: this.refno,
        customercode: this.vendorcode,
        customername: this.vendorname,
        vinvno: this.subinvno,
        vinvdate: this.subinvdate,
        expDeliveryDate: this.expdelidate,
        payTerm: this.paymentTerm,
        remarks: this.remarks,
        termsandcondition: this.termsandcondition,
        invoicecopy: this.invoicecopy,
        subTotal: this.subtotal,
        discountTotal: this.disctotal,
        cgstTotal: this.cgsttotal,
        sgstTotal: this.sgsttotal,
        igstTotal: this.igsttotal,
        tds: this.tdstotal,
        roundedoff: this.roundedoff,
        net: this.nettotal,
        rCreatedDateTime: this.invdate,
        rStatus: 'A',
        company: this.company,
        branch: this.branch,
        fy: this.fy,
        // trRate: this.tpRate,
        // trValue : this.tpValue,
        // pkRate : this.pkRate,
        // pkValue : this.pkValue,
        // inRate : this.insRate,
        // inValue: this.insValue,
        tcsRate: this.tcsrate,
        tcsValue: this.tcsvalue,
        closingValue: this.closingtotal,
        salerefname: this.salerefname,
        vchtype: this.vchtype,
        saleaccount: this.vchaccountcode.toString(),
        deliveryaddress: this.vendordelivery,
      };
      this.salesapi.Insert_Sales(postData).subscribe(() => {
        resolve({ action: 'success' });
      });
    });
  }

  cusFields: Cus[] = [];
  status: any = 'A';
  insertCustomFields() {
    return new Promise((resolve) => {
      for (let i = 0; i < this.sdef.length; i++) {
        var postdata = {
          id: this.getGUID(),
          efieldname: this.sdef[i].efieldname,
          efieldvalue: this.sdef[i].efieldvalue,
          grnno: this.invno.toString(),
          grntype: this.vchtype,
          RCreatedDateTime: new Date(),
          RStatus: this.status,
          company: this.company,
          branch: this.branch,
          fy: this.fy,
        };
        if (this.sdef[i].efieldvalue != '') {
          this.cusFields.push(postdata);
        }
      }
      this.salesapi.insertCusFields(this.cusFields).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }
  dataSource = this.ELEMENT_DATA;
  insertGrnDetails() {
    if (this.pono == '' || this.pono == undefined) {
      this.pono = '';
      this.podate = undefined;
    }
    return new Promise((resolve) => {
      this.dataSource.forEach((element) => {
        (element.invno = this.invno),
          (element.invdate = this.invdate),
          (element.id = this.getGUID()),
          (element.customercode = this.vendorcode),
          (element.branch = this.branch),
          (element.company = this.company),
          (element.fy = this.fy),
          (element.sono = this.pono),
          (element.sodate = this.podate),
          (element.vtype = this.vchtype);
      });
      this.dataSource.forEach((element, index) => {
        var amount = element.amount;
        if (amount === 0) {
          this.dataSource.splice(index, 1);
        }
      });
      this.salesapi
        .Insert_Bulk_Sales_Details(this.dataSource)
        .subscribe((res) => {
          resolve({ action: 'success' });
        });
    });
  }
  salesDiscountAcc: any;
  transportAcc: any;
  packingAcc: any;
  insurenceAcc: any;
  tcsAcc: any;
  roundingAcc: any;

  ledger: Ledger[] = [];

  insertOverDue() {
    return new Promise((resolve) => {
      var postdata = {
        id: this.getGUID(),
        entrytype: 'CUSTOMER_OVERDUE',
        vouchertype: this.vchtype,
        vchno: this.invno.toString(),
        vchdate: this.invdate,
        ledgercode: this.vendorcode,
        amount: this.closingtotal,
        received: 0,
        dueon: this.invdate,
        status: 'UNPAID',
        comp: this.company,
        branch: this.branch,
        fy: this.fy,
        rCreatedDateTime: new Date(),
        rStatus: 'A',
      };

      this.grnapi.Insert_Overdue(postdata).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }
  gstdata: gstdata[] = [];
  insertGstData() {
    return new Promise((resolve) => {
      for (let i = 0; i < this.listData.filteredData.length; i++) {
        let hsn = this.listData.filteredData[i].hsn;
        let taxable = this.listData.filteredData[i].taxable;
        let gst = this.listData.filteredData[i].gst;
        let gstvalue = this.listData.filteredData[i].gstvalue;
        let total = this.listData.filteredData[i].amount;
        var cgst = 0;
        var sgst = 0;
        var igst = 0;
        var cgstvalue = '0.0';
        var sgstvalue = '0.0';
        var igstvalue = 0;
        if (this.vendorstatecode == '33') {
          cgst = parseFloat(gst) / 2;
          sgst = parseFloat(gst) / 2;
          cgstvalue = (parseFloat(gstvalue) / 2).toFixed(2);
          sgstvalue = (parseFloat(gstvalue) / 2).toFixed(2);
        } else {
          igst = parseFloat(gst);
          igstvalue = parseFloat(gstvalue);
        }

        var postdata = {
          Id: this.getGUID(),
          VchNo: this.invno,
          VchDate: this.invdate,
          VchType: this.vchtype,
          SupplyType: 'SALES',
          HSN: hsn,
          Taxable: taxable,
          CGST_Per: cgst ? cgst : 0,
          SGST_Per: sgst ? sgst : 0,
          IGST_Per: igst ? igst : 0,
          CGST_Val: parseFloat(cgstvalue) ? parseFloat(cgstvalue) : 0,
          SGST_Val: parseFloat(sgstvalue) ? parseFloat(sgstvalue) : 0,
          IGST_Val: igstvalue ? igstvalue : 0,
          Total: parseFloat(total) ? parseFloat(total) : 0,
          Date: new Date(),
          Status: 'A',
          branch: this.branch,
          company: this.company,
          fy: this.fy,
        };
        this.gstdata.push(postdata);
      }
      for (let i = 0; i < this.gstlistData.filteredData.length; i++) {
        let hsn = this.gstlistData.filteredData[i].hsn;
        let taxable = this.gstlistData.filteredData[i].accvalue;
        let gst = this.gstlistData.filteredData[i].accgst;
        let gstvalue = this.gstlistData.filteredData[i].accgstvalue;
        let total = this.gstlistData.filteredData[i].accgsttotvalue;
        var cgst = 0;
        var sgst = 0;
        var igst = 0;
        var cgstvalue = '0.0';
        var sgstvalue = '0.0';
        var igstvalue = 0;
        if (this.vendorstatecode == '33') {
          cgst = parseFloat(gst) / 2;
          sgst = parseFloat(gst) / 2;
          cgstvalue = (parseFloat(gstvalue) / 2).toFixed(2);
          sgstvalue = (parseFloat(gstvalue) / 2).toFixed(2);
        } else {
          igst = parseFloat(gst);
          igstvalue = parseFloat(gstvalue);
        }

        var post = {
          Id: this.getGUID(),
          VchNo: this.invno,
          VchDate: this.invdate,
          VchType: this.vchtype,
          SupplyType: 'SALES',
          HSN: hsn,
          Taxable: taxable,
          CGST_Per: cgst ? cgst : 0,
          SGST_Per: sgst ? sgst : 0,
          IGST_Per: igst ? igst : 0,
          CGST_Val: parseFloat(cgstvalue) ? parseFloat(cgstvalue) : 0,
          SGST_Val: parseFloat(sgstvalue) ? parseFloat(sgstvalue) : 0,
          IGST_Val: igstvalue ? igstvalue : 0,
          Total: parseFloat(total) ? parseFloat(total) : 0,
          Date: new Date(),
          Status: 'A',
          branch: this.branch,
          company: this.company,
          fy: this.fy,
        };
        if (this.gstlistData.filteredData[i].acccode != '') {
          this.gstdata.push(post);
        }
      }
      this.gstdataapi.Insert_GstData(this.gstdata).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }
  remove(index: any) {
    if (this.listData.data.length > 1) {
      this.listData.data.splice(index, 1);
      this.listData.data = [...this.listData.data]; // new ref!
      of(this.ELEMENT_DATA).subscribe(
        (data: iprodutcs[]) => {
          this.listData = new MatTableDataSource(data);
        },
        (error) => {
          console.log(error);
        }
      );
      //this.accemprtyGrid();
      this.calculate();
    }
  }
  deleteExistingGRN() {
    return new Promise((resolve) => {
      this.salesapi
        .Delete_Sales(this.invno, 'Service Sale', this.branch, this.fy)
        .subscribe((res) => {
          this.salesapi
            .Delete_SalesDetails(
              this.invno,
              'Service Sale',
              this.branch,
              this.fy
            )
            .subscribe((res) => {
              this.salesapi
                .Delete_Accounts(
                  this.invno,
                  'Service Sale',
                  this.branch,
                  this.fy
                )
                .subscribe((res) => {
                  this.salesapi
                    .Delete_SavedDefSalesFields(
                      this.invno,
                      'Service Sale',
                      this.branch,
                      this.fy
                    )
                    .subscribe((res) => {
                      this.salesapi
                        .Delete_overdue(
                          this.invno,
                          'Service Sale',
                          this.branch,
                          this.fy
                        )
                        .subscribe((res) => {
                          this.salesapi
                            .deteleAllLedger(
                              this.invno,
                              'Service Sale',
                              this.branch,
                              this.fy
                            )
                            .subscribe((res) => {
                              this.gstdataapi
                                .Delete_GstData(
                                  this.invno,
                                  'Service Sale',
                                  this.branch,
                                  this.fy
                                )
                                .subscribe((res) => {
                                  resolve({ action: 'success' });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
  }

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

  //Region Additional Charge Functions
  onAddtionalDDKeydown(event: any, rowindex: any) {
    console.log(rowindex);
    this.eAddCharge.toArray()[rowindex].nativeElement.value = '';
    this.eAddCharge.toArray()[rowindex].nativeElement.select();
    this.eAddCharge.toArray()[rowindex].nativeElement.focus();
  }
  onAddtionalAmountKeydown(event: any, rowindex: any) {
    this.eAddGstDD.toArray()[rowindex].nativeElement.value = '';
    this.eAddGstDD.toArray()[rowindex].nativeElement.select();
    this.eAddGstDD.toArray()[rowindex].nativeElement.focus();
  }
  onAddtionalGSTKeydown(event: any, rowindex: any) {
    //this.gstaddRow();
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
      this.gstlistData.filteredData[i].accgsttotvalue = parseFloat(amount)
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
          this.gstlistData.filteredData[i].accgsttotvalue = parseFloat(amount);
          this.calculate();
        }
      }
      this.calculate();
    }
  }

  ShowAddDelivery() {
    this.api.showDeliveryAddress(this.vendorcode).subscribe((res) => {
      let dialogRef = this.dialog.open(ShowdelivaddressComponent, {
        // maxWidth: '90vw',
        // maxHeight: '90vh',
        // height: '55%',
        // width: '70%',
        // panelClass: 'full-screen-modal'
      });
      dialogRef.componentInstance.data = JSON.parse(res);
      dialogRef.afterClosed().subscribe((result) => {
        this.vendordelivery = result.addr;
      });
    });
  }
  AddDelivery() {
    let dialogRef = this.dialog.open(AdddelivaddressComponent, {
      // maxWidth: '90vw',
      // maxHeight: '90vh',
      // height: '55%',
      // width: '70%',
      // panelClass: 'full-screen-modal'
    });
    //dialogRef.componentInstance.data = "";
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.saveDeliveryAddress(result);
      }
    });
  }
  saveDeliveryAddress(addr: any) {
    var postdata = {
      id: this.getGUID(),
      company: this.company,
      ledgercode: this.vendorcode,
      deliveryAddress: addr,
    };
    this.api.Inser_DelivertAddress(postdata).subscribe((res) => {
      this.vendordelivery = addr;
      Swal.fire({
        icon: 'success',
        title: 'Saved',
        text: 'Address Saved!',
      });
    });
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
    this.vendordelivery = '';
  }
}
