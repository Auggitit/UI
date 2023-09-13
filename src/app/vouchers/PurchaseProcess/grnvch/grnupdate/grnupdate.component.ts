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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { map, Observable, of, startWith, Subscription } from 'rxjs';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ApiService } from 'src/app/services/api.service';
import { GrnService } from 'src/app/services/grn.service';
import Swal from 'sweetalert2';
import { PoService } from 'src/app/services/po.service';
import { ViewportScroller } from '@angular/common';
import {
  Acc,
  Cus,
  Ledger,
  Product,
  Vendor,
  gst,
  gstdata,
  iaccounts,
  igstaccounts,
  iprodutcs,
} from 'src/app/Component/Interface/all-interface';
import { VendorComponentComponent } from 'src/app/Component/vendor-component/vendor-component.component';
import { GstdataService } from 'src/app/services/gstdata.service';
import { PurchasevtypeComponent } from 'src/app/vchtype/purchasevtype/purchasevtype.component';
@Component({
  selector: 'app-grnupdate',
  templateUrl: './grnupdate.component.html',
  styleUrls: ['./grnupdate.component.scss'],
})
export class GrnupdateComponent implements OnInit {
  //#region constructor
  constructor(
    public grnapi: GrnService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public api: ApiService,
    public router: Router,
    public poapi: PoService,
    public activatedRoute: ActivatedRoute,
    private viewportScroller: ViewportScroller, public gstdataapi: GstdataService
  ) {}
  //#endregion
  //#region view
  @ViewChild('pacc') pacc: ElementRef | undefined;
  @ViewChild('table') tabledata!: MatTable<Element>;
  @ViewChildren('eprod') private eprod!: QueryList<ElementRef>;
  @ViewChildren('esku') private esku!: QueryList<ElementRef>;
  @ViewChildren('ehsn') private ehsn!: QueryList<ElementRef>;
  @ViewChildren('eqty') private eqty!: QueryList<ElementRef>;
  @ViewChildren('eqtymt') private eqtymt!: QueryList<ElementRef>;
  @ViewChildren('erate') private erate!: QueryList<ElementRef>;
  @ViewChildren('edisc') private edisc!: QueryList<ElementRef>;
  @ViewChildren('ediscvalue') private ediscvalue!: QueryList<ElementRef>;
  @ViewChildren('etax') private etax!: QueryList<ElementRef>;
  @ViewChildren('etaxvalue') private etaxvalue!: QueryList<ElementRef>;
  @ViewChildren('eamt') private eamt!: QueryList<ElementRef>;
  @ViewChildren('egodown') private egodown!: QueryList<ElementRef>;
  @ViewChildren('etransport') private etransport!: QueryList<ElementRef>;
  @ViewChildren('epacking') private epacking!: QueryList<ElementRef>;
  //Vendors
  @ViewChild('evendorname') evendorname: ElementRef | undefined;
  //#endregion
  @ViewChildren('eAddCharge') private eAddCharge!: QueryList<ElementRef>;  
  @ViewChildren('eAddGstDD') private eAddGstDD!: QueryList<ElementRef>;   

  @ViewChild(VendorComponentComponent)
  childComponent!: VendorComponentComponent;

  callChildFunction() {
    this.childComponent.changeVendor();
  }
  vendorcode: any;
  vendorname: any;
  vendorstatecode: any;
  VendorCode(event: any) {
    (this.vendorcode = event.vcode),
      (this.vendorname = event.vname),
      (this.vendorstatecode = event.vstatecode);
      this.calculate();
  }

  //#region onload
  invdate: any;
  listData!: MatTableDataSource<any>;
  gstlistData!: MatTableDataSource<any>;
  acclistData!: MatTableDataSource<any>;
  loading: boolean = false;
  companycode: string = '001';
  branchcode: string = '001';
  fy: string = '23-24';
  status: string = 'A';

  //Vendor
  vendoroutstanding: any = 0.0;
  filteredVendors!: Observable<Vendor[]>;
  vendorSearch = new FormControl('');
  vendorsArray: Vendor[] = [];
  vendorpodatacount = 0;
  vendorpodata: any;
  selectedvendor: any;  
  vendorstate: any;  
  vendorgstno: any;
  vendorbilling: any;
  vendorgstTreatment: any;
  vendors: any = [];

  vendorChanged(event: any, data: any) {
    if (event.isUserInput == true) {
      this.grnapi
        .getPendingPoListDetails(data.LedgerCode, this._branch, this._fy)
        .subscribe((res) => {
          this.vendorpodatacount = res.length;
          this.vendorpodata = res;
        });
      this.grnapi
        .getPendingPoOutstanding(data.LedgerCode, this._branch, this._fy)
        .subscribe((res) => {
          this.vendoroutstanding = res[0].net_balance;
        });
      this.selectedvendor = data;
      this.vendorcode = data.LedgerCode.toString();
      this.vendorname = data.CompanyDisplayName;
      this.vendorgstno = data.GSTNo;
      this.vendorbilling = data.BilingAddress;
      this.vendorgstTreatment = data.GSTTreatment;
      this.vendorstate = data.StateName;
      this.vendorstatecode = data.stateCode;  
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
    this.vendorpodata = '';
    this.vendoroutstanding = '';
    this.vendorpodatacount = 0;    
    this.calculate();
  }

  loadVendors() {
    return new Promise((resolve) => {
      this.grnapi.getVendors().subscribe((res) => {
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

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    // this.invdate = new Date();
    // this.gstArray.splice(0);
    // this.gstArray.push({ gst: 'NO GST', hsn: '' });
    this.setValidator();
    this.loadPurchaseAccounts();
    this.emptyrowonload();
    this.loadProducts();
    this.loadDefalutAccounts();
    this.loadDefControl();
    this.loadSavedAccounts();
    this.loadgst();
    this.loadVendors();

    var id = this.activatedRoute.snapshot.paramMap.get('id');
   
    if (id !== null) {
      this.invno = decodeURIComponent(id);
      this.loadPreviousBills();
    }
    // var id = this.activatedRoute.snapshot.queryParamMap.get('secureValue');
    // if (id !== null) {
    //   this.invno = decodeURIComponent(id);
    // }
    // var fy = this.activatedRoute.snapshot.paramMap.get('fy');
    // var id = this.activatedRoute.snapshot.queryParamMap.get('secureValue');
    //   if (id !== null) {
    //     var originalValue = window.history.state.originalValue;
    //     if (originalValue) {
    //       this.invno = decodeURIComponent(originalValue);
    //     }
    //   }
    // var id = this.activatedRoute.snapshot.paramMap.get('id');
    //   if (id !== null) {
    //     var originalValue = window.history.state.originalValue;
    //     if (originalValue) {
    //       this.invno = decodeURIComponent(originalValue);
    //     }
    //   }
    
  }

  //#endregion

  array: gst[] = [];
  loadgst() {
    this.grnapi.getGstAccounts().subscribe((res) => {
      this.array = res;
    });
  }

  //#region outstanding
  tpRate: any = 0;
  pkRate: any = 0;
  tcsrate: any = 0.0;
  insRate: any = 0;
  roundedoff: any = 0.0;
  //#endregion
  //#endregion
  //#endregion
  //#region Previousbills
  loadPreviousBills() {
    this.loadSavedSdef();
    this.loadGRNDetails().then((res) => {
      this.loadGRN().then((res) => {  
         this.loadLedger().then((res) => {            
          this.calculate();
        });
      });
    });
  }
  sdef: any;
  sdefload: any;
  loadpdef() {
    return new Promise((resolve, reject) => {
      this.poapi.getDefPOFields().subscribe((res) => {
        this.sdef = res;
        resolve({ action: 'success' });
      });
    });
  }
  loadSavedSdef() {
    this.grnapi.getCusList(this.invno).subscribe((res) => {
      this.sdefload = res;

      if (this.sdefload.length == 0) {
        this.loadpdef().then(() => {
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
  loadGRNDetails() {
    return new Promise((resolve) => {
      this.emprtyGrid();
      this.grnapi.get_GRNDetails(this.invno).subscribe((res) => {        
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
            v.gst,v.uom,v.uomcode
          );
        });
        //
        this.textBoxCalculation();
        resolve({ action: 'success' });
        // this.acclistData.filteredData[0].acccode = '18';
      });     
    });
  }
 
  //#region loadgrn
  vendordelivery: any;
  loadGRN() {
    return new Promise((resolve) => {
      this.grnapi.get_GRN(this.invno).subscribe((res) => {
        this.invno = res[0].grnno;
        this.invdate = res[0].grndate;
        this.pono = res[0].pono;
        this.podate = res[0].podate;
        this.roundedoff = res[0].roundedoff;
        this.grnid = res[0].grnid;
        this.tpRate = res[0].trRate;
        this.pkRate = res[0].pkRate;
        this.insRate = res[0].inRate;
        this.tcsrate = res[0].tcsRate;
        this.tcsvalue = res[0].tcsValue;
        this.vendordelivery = res[0].deliveryaddress;
        this.expdelidate = res[0].expDeliveryDate;
        this.refno = res[0].ref;
        this.vendorcode = res[0].vendorcode;
        this.vendorname = res[0].vendorname;
        this.remarks = res[0].remarks;
        this.termsandcondition = res[0].termsandcondition;
        this.roundedoff = res[0].roundedoff;
        this.subinvno = res[0].vinvno;
        this.subinvdate = res[0].vinvdate;
        this.expdelidate = res[0].expDeliveryDate;
        this.refno = res[0].refno;
        this.salerefname = res[0].salerefname;
        this.vchaccount = res[0].accountname;
        this.vchaccountcode = res[0].saleaccount;
        this.paymentTerm = res[0].payTerm;
        this.vchtype = res[0].vchtype;
        console.log("vendor", this.vendorcode);
        this.findvendor(this.vendorcode).then(() => {
          resolve({ action: 'success' });
        });        
      });      
    });
  }

  findvendor(code: any) {
    return new Promise((resolve) => {
      const found = this.vendors.find((obj: any) => {
        return obj.LedgerCode === parseInt(code);
      });

      if (found) {
        console.log("Party Found");
        this.vendorname = found.CompanyDisplayName;
        this.vendorgstno = found.GSTNo;
        this.vendorbilling = found.BilingAddress;
        this.vendorgstTreatment = found.GSTTreatment;
        this.vendorstate = found.StateName;
        this.vendorstatecode = found.stateCode;
        this.calculate();
        this.grnapi
        .getPendingPoOutstanding(this.vendorcode, this._branch, this._fy)
        .subscribe((res) => {
          this.vendoroutstanding = res[0].net_balance;
          this.calculate();
          resolve({action:"success"});
       });            
      }
    });
  }

  //#endregion
  //#region loadledger
  name: any;
  loadLedger() {
    return new Promise((resolve) => {
      this.emptyGstGrid();
      this.loadDefalutAccounts().then(res =>
        {
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
                var totalgst = cal + parseFloat(res[i].dr);
                const newrow = {
                  acccode: res[i].acccode,
                  accname: this.name,
                  accvalue: res[i].dr,
                  accgst: res[i].gst,
                  accgstvalue: cal.toString(),
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
        })
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
  //#endregion
  //#endregion
  //#region Arrays
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
      uom: '',
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
      vchtype: '',uomcode: ''
    },
  ];
  GST_DATA: igstaccounts[] = [
    {
      acccode: '',
      accname: '',
      accvalue: 0,
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
      accvalue: 0,
      acckey: '',
    },
  ];
  //#endregion
  //#region guid
  getGUID() {
    var gid: any;
    gid = Guid.create();
    return gid.value;
  }
  //#endregion
  //#region set validations
  formGRN!: FormGroup;
  setValidator() {
    this.formGRN = this.fb.group({
      cinvno: ['', [Validators.required]],
      cpacc: ['', [Validators.required]],
      cinvdate: ['', [Validators.required]],
      cvendorname: ['', [Validators.required]],
      cpono: ['', [Validators.nullValidator]],
      cpodate: ['', [Validators.nullValidator]],
      cvchtype: ['', [Validators.nullValidator]],
      cvchaccount: ['', [Validators.nullValidator]],
      crefno: ['', [Validators.nullValidator]],
      csubinvno: ['', [Validators.required]],
      csupinvdate: ['', [Validators.required]],
      cexpdelidate: ['', [Validators.nullValidator]],
      cpaymentTerm: ['', [Validators.nullValidator]],
    });
  }
  //#endregion
  //#region MaxInvoice No
  _company = '001';
  _branch = '001';
  _fy = '001';
  _fyname = '23-24';
  vchtype: any;
  invno: any;

  //#endregion
  //#region First Card Fields
  //#region ngModel 1st row
  pono: any = '';
  podate: any;
  vchaccount: any;
  //#endregion
  //#region AccountName
  accArray: Acc[] = [];
  filteredAccounts!: Observable<Acc[]>;
  accSearch = new FormControl('');
  vchaccountcode: any;
  loadPurchaseAccounts() {
    this.grnapi.getPurchaseAccounts().subscribe((res) => {
      this.accArray = JSON.parse(res);
      this.filteredAccounts = this.accSearch.valueChanges.pipe(
        startWith(''),
        map((acc) => (acc ? this._filterAccounts(acc) : this.accArray.slice()))
      );
    });
  }
  private _filterAccounts(value: string): Acc[] {
    const filterValue = value.toLowerCase();
    return this.accArray.filter((acc) =>
      acc.ledgername.toLowerCase().includes(filterValue)
    );
  }
  accountChanged(event: any, data: any) {
    if (event.isUserInput == true) {
      this.vchaccountcode = data.ledgercode;
      this.calculate();
    }
  }
  //#endregion
  //#region Voucher Type AutoFill
  // callChangeVoucherType() {
  //   let dialogRef = this.dialog.open(PurchasevtypeComponent, {});
  //   dialogRef.afterClosed().subscribe((result) => {
  //     this.vchtype = result.vtype;
  //     this.getMaxInvoiceNo();
  //     //this.vchaccount = result.vacco;
  //   });
  // }
  //#endregion
  //#endregion
  //#region Second card First Row Fields
  //#region variables 2nd row

  //#endregion

  //#region Second Card Second Row Fields
  //#region Ngmodels
  subinvno: any;
  subinvdate: any;
  expdelidate: any;
  refno: any;
  //#endregion
  //#region paymentTerms
  paymentTerm: any;
  getPayTerm(event: any) {
    if (event.isUserInput == true) {
      this.paymentTerm = event.source.triggerValue;
      // console.log(this.paymentTerm);
    }
  }
  //#endregion
  //#endregion
  //#region  table
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
  //#region Product
  loadProducts() {
    this.poapi.getProducts().subscribe((res) => {     
      this.prodArray = JSON.parse(res);
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
      this.listData.filteredData[rowindex].product = data.itemname.toString();
      this.listData.filteredData[rowindex].productcode =
        data.itemcode.toString();
      this.listData.filteredData[rowindex].sku = data.itemsku;
      this.listData.filteredData[rowindex].hsn = data.itemhsn;
      this.listData.filteredData[rowindex].uom = data.uom;      
      this.listData.filteredData[rowindex].gst = data.gst;
      this.listData.filteredData[rowindex].uomcode = data.uomcode.toString();  
      // console.log(data);
      //console.log(this.listData.filteredData);
    }
  }
  //#endregion

  private dialogRef!: MatDialogRef<PurchasevtypeComponent>;
  private dialogRefSubscription!: Subscription;
  callChangeVoucherType() {
    this.dialogRef = this.dialog.open(PurchasevtypeComponent, {});
    this.dialogRefSubscription = this.dialogRef
      .afterClosed()
      .subscribe((result) => {
        this.vchtype = result.vtype;
        //this.Vprefix = result.vprefix;        
      });
  }

   //#region ADDon
   onAddonRateKeydown(event: any, rowindex: any) {
    var qty = this.listData.filteredData[rowindex].qty;
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if (qty === ''|| qty === null) {
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
    if (qty === ''|| qty === null) {
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
    if (qty === ''|| qty === null) {
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
    if (qty === ''|| qty === null) {
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
    if (qty === ''|| qty === null) {
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
    if (qty === ''|| qty === null) {
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
    if (qty === ''|| qty === null) {
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

    console.log(this.gstlistData.filteredData,"NO GST");
    for (let i = 0; i < this.gstlistData.filteredData.length; i++) {

      this.gstlistData.filteredData[i].accgst = 'NO GST';
      this.gstlistData.filteredData[i].accgsttotvalue = this.gstlistData.filteredData[i].accvalue;
      this.gstlistData.filteredData[i].accgstvalue = "0";      
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
    if (qty === ''|| qty === null) {
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
  //#region Lastrow First Col
  loadDefalutAccounts() {
    return new Promise((resolve)=>
      {
        this.grnapi.getDefaultAccounts().subscribe((res) => {
          this.defaultAccounts = JSON.parse(res);
          this.filteredDef = this.defaultAccounts;
          resolve({action:'success'});
        });
      });
    
  }
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
  loadDefControl() {
    this.poapi.getDefPOFields().subscribe((res) => {
      this.sdef = res;
    });
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
  //#region calculation
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
  tdsper: any;
  cgsttotal: any = 0.0;
  sgsttotal: any = 0.0;
  igsttotal: any = 0.0;
  subwithoutcharges: any;


  chk:any=true;
  roundmethod:any="AUTO";
  callRoundFunctions(event:any)
  {
    if(event == true)
    {
      this.roundmethod = "AUTO"
      this.calculate();
    }
    else
    {
      this.roundmethod = "MANUAL"
      this.roundedoff = "0";
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
        var _cgst = (parseFloat(__gst)/2);
        var _sgst = (parseFloat(__gst)/2);
        var _cgstvalue = parseFloat(__gstvalue)/2;
        var _sgstvalue = parseFloat(__gstvalue)/2;

        var _gsttype = "INPUT";
        var _state = "STATE";
        var _central = "CENTRAL";
        
        //For State Tax
        var fasgst = this.array.find(
          (o:any) => o.gsttype == _gsttype && o.taxtype == _state && o.gstper == _sgst
        );        
        //Ledger code, ledger Name, gst Value, KEY
        this.addAccDataRow(fasgst?.ledgercode, _gsttype + " SGST @ " + _sgst, 0, _state);        
        //GET Previous Value
        prevSGST = parseFloat(
        this.acclistData.filteredData
        [
          this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(
            (o) => o.acccode === fasgst?.ledgercode 
          ))
        ].accvalue);
        //SET Previous SGST Value
        this.acclistData.filteredData
        [
          this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(
            (o) => o.acccode === fasgst?.ledgercode 
          ))
        ].accvalue = prevSGST + _sgstvalue;
       
        //For Central Tax
        var facgst = this.array.find(
          (o:any) => o.gsttype == _gsttype && o.taxtype == _central && o.gstper == _cgst
        );        
        //Ledger code, ledger Name, gst Value, KEY
        this.addAccDataRow(facgst?.ledgercode, _gsttype + " CGST @ " + _cgst, 0, _central);

        //GET Previous CGST Value
        prevCGST = parseFloat(
          this.acclistData.filteredData
          [
            this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(
              (o) => o.acccode === facgst?.ledgercode 
            ))
        ].accvalue);

        //SET Previous SGST Value
        this.acclistData.filteredData
        [
          this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(
            (o) => o.acccode === facgst?.ledgercode 
          ))
        ].accvalue = prevCGST + _cgstvalue;     
      } 
      else if (this.vendorstatecode != '33') {    

        var _igst = this.listData.filteredData[i].gst;
        var _igstvalue = this.listData.filteredData[i].gstvalue;

        var _gsttype = "INPUT";
        var _integrated = "INTEGRATED";        
        
        //For State Tax
        var faigst = this.array.find(
          (o:any) => o.gsttype == _gsttype && o.taxtype == _integrated && o.gstper == _igst
        );        
        //Ledger code, ledger Name, gst Value, KEY
        this.addAccDataRow(faigst?.ledgercode, _gsttype + " IGST @ " + _igst, 0, _integrated);
        
        //GET Previous IGST Value
        prevIGST = parseFloat(
        this.acclistData.filteredData
        [
          this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(
            (o) => o.acccode === faigst?.ledgercode 
          ))
        ].accvalue);           

        //SET Previous IGST Value
        this.acclistData.filteredData
        [
          this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(
            (o) => o.acccode === faigst?.ledgercode 
          ))
        ].accvalue = prevIGST + parseFloat(_igstvalue);   
      }
      gstAmount = gstAmount + parseFloat(this.listData.filteredData[i].gstvalue);
    }

    //Additional 
    for (let i = 0; i < this.gstlistData.filteredData.length; i++) 
    {
      if (this.vendorstatecode == '33') 
      {                        
        var __gst = this.gstlistData.filteredData[i].accgst;
        var __gstvalue = this.gstlistData.filteredData[i].accgstvalue;
        var __gst = isNaN(parseFloat(__gst)) ? '0' : __gst;            

        var _cgst = (parseFloat(__gst)/2);
        var _sgst = (parseFloat(__gst)/2);
        var _cgstvalue = (parseFloat(__gstvalue)/2);
        var _sgstvalue = (parseFloat(__gstvalue)/2);

        var _gsttype = "INPUT";
        var _state = "STATE";
        var _central = "CENTRAL";
        
        //For State Tax
        var fasgst = this.array.find(
          (o:any) => o.gsttype == _gsttype && o.taxtype == _state && o.gstper == _sgst
        );        
        //Ledger code, ledger Name, gst Value, KEY
        this.addAccDataRow(fasgst?.ledgercode, _gsttype + " SGST @ " + _sgst, 0, _state);        
        //GET Previous Value
        prevSGST = parseFloat(
        this.acclistData.filteredData
        [
          this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(
            (o) => o.acccode === fasgst?.ledgercode 
          ))
        ].accvalue);
        //SET Previous SGST Value
        this.acclistData.filteredData
        [
          this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(
            (o) => o.acccode === fasgst?.ledgercode 
          ))
        ].accvalue = prevSGST + _sgstvalue;
       
        //For Central Tax
        var facgst = this.array.find(
          (o:any) => o.gsttype == _gsttype && o.taxtype == _central && o.gstper == _cgst
        );        
        //Ledger code, ledger Name, gst Value, KEY
        this.addAccDataRow(facgst?.ledgercode, _gsttype + " CGST @ " + _cgst, 0, _central);

        //GET Previous CGST Value
        prevCGST = parseFloat(
          this.acclistData.filteredData
          [
            this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(
              (o) => o.acccode === facgst?.ledgercode 
            ))
        ].accvalue);

        //SET Previous SGST Value
        this.acclistData.filteredData
        [
          this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(
            (o) => o.acccode === facgst?.ledgercode 
          ))
        ].accvalue = prevSGST + _cgstvalue;     

      } 
      else if (this.vendorstatecode != '33') 
      {        
        var __gst = this.gstlistData.filteredData[i].accgst;
        var __gstvalue = this.gstlistData.filteredData[i].accgstvalue;
        _igstvalue = parseFloat(__gstvalue);
        var __gst = isNaN(parseFloat(__gst)) ? '0' : __gst;
       
        var _gsttype = "INPUT";
        var _integrated = "INTEGRATED";        
        
        //For State Tax
        var faigst = this.array.find(
          (o:any) => o.gsttype == _gsttype && o.taxtype == _integrated && o.gstper == _igst
        );        
        //Ledger code, ledger Name, gst Value, KEY
        this.addAccDataRow(faigst?.ledgercode, _gsttype + " IGST @ " + _igst, 0, _integrated);
        
        //GET Previous IGST Value
        prevSGST = parseFloat(
        this.acclistData.filteredData
        [
          this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(
            (o) => o.acccode === faigst?.ledgercode 
          ))
        ].accvalue);

        //SET Previous IGST Value
        this.acclistData.filteredData
        [
          this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(
            (o) => o.acccode === faigst?.ledgercode 
          ))
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
      (parseFloat(this.subtotal) + parseFloat(this.additionalCharge) - parseFloat(this.disctotal)) + gstAmount;     
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
    if(this.roundmethod == "AUTO")      
    {
      var rounded = Math.round(parseFloat(this.closingtotal));
      var roundedvalue = rounded - parseFloat(this.closingtotal);      
      this.roundedoff = roundedvalue.toFixed(2);
      this.closingtotal = rounded.toFixed(2);
    }
    else
    {
      this.closingtotal = parseFloat(this.closingtotal) + parseFloat(this.roundedoff);
    }

    //Removing Zero Values
    this.acclistData.data.forEach((e, index) => {
      if(parseFloat(e.accvalue) == 0)
      {
        console.log("Zero find", index);
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
  //#region  clear,empty,add,remove row and fields
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
  addDataRow(
    pcode: any,
    pname: any,
    sku: any,
    hsn: any,
    godown: any,
    qty: any,
    rate: any,
    disc: any,
    tax: any,uom:any,uomcode:any
  ) {
    return new Promise((resolve) => {
      const newRow = {
        id: this.getGUID(),
        grnno: '1',
        grndate: this.invdate,
        product: pname,
        productcode: pcode,
        sku: sku,
        hsn: hsn,
        godown: godown,
        qty: qty,
        uom: uom,
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
        vendorcode: '',
        pono: '',
        podate: '',
        vchtype: '',uomcode:uomcode
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
  addRow() {
    return new Promise((resolve) => {
      const newRow = {
        id: this.getGUID(),
        grnno: '1',
        grndate: this.invdate,
        product: '',
        productcode: '',
        sku: '',
        hsn: '',
        godown: '',
        qty: 0,
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
        vendorcode: '',
        pono: '',
        podate: '',
        vchtype: '',uomcode:''
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
  gstaddRow() {
    return new Promise((resolve) => {
      const newRow = {
        acccode: '',
        accname: '',
        accvalue: 0,
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
      this.findGst()      
      resolve({ action: 'success' });
    });
  }

  loadgstwithvalue() {
    for (var i = 0; i < this.gstlistData.data.length; i++) {
      this.gstlistData.filteredData[i].accgst = 'NO GST';
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
  }

  addAccDataRow(acode: any, aname: any, avalue: any, akey: any) 
  {
    if (this.acclistData.filteredData)
    var obj = this.acclistData.filteredData.find((o) => o.acccode === acode);
    if (obj == undefined || obj.length == 0) 
    {
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
    } 
    else 
    {
      return new Promise((resolve) => {
        resolve({ action: 'success' });
      });
    }
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
          this.deleteExistingGRN().then((res) => {
            this.insertGrnDetails().then((res) => {
              this.insertCustomFields().then((res) => {
                this.insertGrn().then((res) => {               
                    this.insertOverDue().then((res) => {
                      this.insertGstData().then((res) => {
                        this.showSuccessMsg();
                      });
                    });
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
  deleteExistingGRN() {
    return new Promise((resolve) => {
      this.grnapi.Delete_GRNDetails(this.invno, this.vchtype, this._branch, this._fy).subscribe((res) => {
        this.grnapi.Delete_GRN(this.invno, this.vchtype, this._branch, this._fy).subscribe((res) => {
          this.grnapi.Delete_CusdefFields(this.invno,this.vchtype,this._branch,this._fy).subscribe((res) => {
            this.grnapi.deteleAllLedger(this.invno,this.vchtype,this._branch,this._fy).subscribe((res) => {
              this.gstdataapi.Delete_GstData(this.invno,this.vchtype,this._branch,this._fy).subscribe((res) => {
                this.grnapi.Delete_overdue(this.invno,this.vchtype,this._branch,this._fy).subscribe((res) => {
                   resolve({ action: 'success' });
                });
              });
            });
          });
        });
      });
    });
  }
  //#endregion
  //#region validate
  salerefname: any = '0';
  validate() {
    var res: boolean = false;
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
          text: 'Plase Refresh and Continue!',
        });
      }
    }
    if (this.pono != undefined && this.pono != '') {
      if (this.podate == '' || this.podate == undefined) {
        Swal.fire({
          icon: 'info',
          title: 'PO Date Need!',
          text: 'Please Select PO Date!',
        });
        res = false;
        return res;
      } else {
        res = true;
      }
    }
    if (this.vendorcode == '' || this.vendorcode == undefined) {
      Swal.fire({
        icon: 'info',
        title: 'Vendor Account Need!',
        text: 'Please Select Vendor!',
      });
      res = false;
      return res;
    } else {
      res = true;
    }
    if (this.vchtype == '' || this.vchtype == undefined) {
      Swal.fire({
        icon: 'info',
        title: 'Voucher Type Need!',
        text: 'Please Select Voucher Type!',
      });
      res = false;
      return res;
    } else {
      res = true;
    }
    if (this.vchaccountcode == '' || this.vchaccountcode == undefined) {
      Swal.fire({
        icon: 'info',
        title: 'Purchase Account Need!',
        text: 'Please Select Purchase Account!',
      });
      res = false;
      return res;
    } else {
      res = true;
    }
    if (this.subinvno == '' || this.subinvno == undefined) {
      Swal.fire({
        icon: 'info',
        title: 'Vendor Bill No Need!',
        text: 'Please Enter Bill Vendor Bill No!',
      });
      res = false;
      return res;
    } else {
      res = true;
    }
    if (this.subinvdate == '' || this.subinvdate == undefined) {
      Swal.fire({
        icon: 'info',
        title: 'Vendor Bill Date Need!',
        text: 'Please Select Vendor Bill Date!',
      });
      res = false;
      return res;
    } else {
      res = true;
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
      res = false;
      return res;
    } else {
      res = true;
    }
    if (parseFloat(this.nettotal) > 0) {
      res = true;
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Plase Add Products',
        text: 'No Products Added or Values not Specified!',
      });
      res = false;
      return res;
    }
    return res;
  }
  //#endregion
  //#region successmsg
  showSuccessMsg() {
    let dialogRef = this.dialog.open(SuccessmsgComponent, {
      //width: '350px',
      data: 'Voucher Successfully Updated!',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loading = false;
      this.clear();
      //this.eitemname?.nativeElement.focus();
    });
  }
  //#endregion
  //#region clear
  vendordiv = false;
  tpValue: any = 0.0;
  pkValue: any = 0.0;
  insValue: any = 0.0;
  clear() {
    this.ledger = [];
    this.cusFields = [];
    this.gstdata = [];
    this.gstArray.splice(0);
    this.gstArray.push({ gst: 'NO GST', hsn: '' });
    this.invdate = new Date();
    this.pono = undefined;
    this.podate = undefined;
    this.vendordiv = false;
    this.vchaccount = '';
    //this.callChildFunction();
    this.subinvno = '';
    this.subinvdate = undefined;
    this.expdelidate = undefined;
    this.paymentTerm = '';
    this.refno = '';
    this.remarks = '';
    this.termsandcondition = '';
    this.roundedoff = '0';
    this.tpRate = '';
    this.tpValue = '';
    this.pkRate = '';
    this.pkValue = '';
    this.insRate = '';
    this.insValue = '';
    this.tcsrate = '';
    this.tcsvalue = '';
    this.sdef.efieldvalue = '';
    this.removeAll();
    this.calculate();
    this.loadDefControl();
    this.goback();
  }

  //#endregion
  //#region Insert
  //#region insertcustomerFields
  cusFields: Cus[] = [];
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
          company: this._company,
          branch: this._branch,
          fy: this._fy,
        };
        if (this.sdef[i].efieldvalue != '') {
          this.cusFields.push(postdata);
        }
      }
      this.grnapi.insertCusFields(this.cusFields).subscribe((res) => {});
      resolve({ action: 'success' });
    });
  }
  //#endregion
  dataSource = this.ELEMENT_DATA;
  insertGrnDetails() {
    return new Promise((resolve) => {
      this.dataSource.forEach((element) => {
        (element.grnno = this.invno),
          (element.grndate = this.invdate),
          (element.id = this.getGUID()),
          (element.vendorcode = this.vendorcode),
          (element.branch = this._branch),
          (element.company = this._company),
          (element.fy = this._fy),
          (element.pono = this.pono),
          (element.podate = this.podate);
        element.vchtype = this.vchtype;
      });
      this.dataSource.forEach((element, index) => {
        var amount = element.amount;
        if (amount === 0) {
          this.dataSource.splice(index, 1);
        }
      });
      this.grnapi.Insert_Bulk_GRN_Details(this.dataSource).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }
  //#region insert vgrn
  invoicecopy: any = '';
  tdstotal: any = 0.0;
  grnid: any;
  insertGrn() {
    return new Promise((resolve) => {
      var postData = {
        id: this.getGUID(),
        grnno: this.invno,
        grnid: this.grnid,
        grndate: this.invdate,
        pono: this.pono,
        podate: this.podate,
        refno: this.refno,
        vendorcode: this.vendorcode,
        vendorname: this.vendorname,
        vinvno: this.subinvno,
        vinvdate: this.subinvdate,
        expDeliveryDate: this.expdelidate,
        payTerm: this.paymentTerm,
        remarks: this.remarks,
        termsandcondition: this.termsandcondition,
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
        tds: isNaN(parseFloat(this.tdstotal)) ? 0 : parseFloat(this.tdstotal),
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
        closingValue: isNaN(parseFloat(this.closingtotal))
          ? 0
          : parseFloat(this.closingtotal),

        rCreatedDateTime: this.invdate,
        rStatus: 'A',
        company: this._company,
        branch: this._branch,
        fy: this._fy,
        accountname: this.vchaccount,
        salerefname: this.salerefname,
        vchtype: this.vchtype,
        saleaccount: this.vchaccountcode.toString(),
        deliveryaddress: '',
      };
      this.grnapi.Insert_GRN(postData).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }
  //#endregion
  insertOverDue() {
    return new Promise((resolve) => {
      var postdata = {
        id: this.getGUID(),
        entrytype: 'VENDOR_OVERDUE',
        vouchertype: this.vchtype,
        vchno: this.invno.toString(),
        vchdate: this.invdate,
        ledgercode: this.vendorcode,
        amount: this.closingtotal,
        received: 0,
        dueon: this.invdate,
        status: 'UNPAID',
        comp: this._company,
        branch: this._branch,
        fy: this._fy,
        rCreatedDateTime: new Date(),
        rStatus: 'A',
      };
      // console.log(postdata);
      this.grnapi.Insert_Overdue(postdata).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }

  //#region InserAllLedger
  ledger: Ledger[] = [];
  //#endregion
  //#region insertgrndata
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
          SupplyType: 'Purchase',
          HSN: hsn,
          Taxable: taxable.toString(),
          CGST_Per: cgst ? cgst : 0,
          SGST_Per: sgst ? sgst : 0,
          IGST_Per: igst ? igst : 0,
          CGST_Val: parseFloat(cgstvalue).toFixed(2) ? parseFloat(cgstvalue) : 0,
          SGST_Val: parseFloat(sgstvalue).toFixed(2) ? parseFloat(sgstvalue) : 0,
          IGST_Val: igstvalue ? igstvalue : 0,
          Total: parseFloat(total).toFixed(2) ? parseFloat(total) : 0,
          Date: new Date(),
          Status: 'A',
          branch: this._branch,
          company: this._company,
          fy: this._fy,
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
          SupplyType: 'Purchase',
          HSN: hsn,
          Taxable: taxable.toString(),
          CGST_Per: cgst ? cgst : 0,
          SGST_Per: sgst ? sgst : 0,
          IGST_Per: igst ? igst : 0,
          CGST_Val: parseFloat(cgstvalue).toFixed(2) ? parseFloat(cgstvalue) : 0,
          SGST_Val: parseFloat(sgstvalue).toFixed(2) ? parseFloat(sgstvalue) : 0,
          IGST_Val: igstvalue ? igstvalue : 0,
          Total: parseFloat(total) ? parseFloat(total) : 0,
          Date: new Date(),
          Status: 'A',
          branch: this._branch,
          company: this._company,
          fy: this._fy,
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
  //#endregion

  //#endregion
  //#region  navigation
  gotoGrnList() {
    this.router.navigateByUrl('grnlist');
    this.viewportScroller.scrollToPosition([0, 0]);
  }
  goback() {
    this.router.navigateByUrl('grn');
    this.viewportScroller.scrollToPosition([0, 0]);
  }
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
  //#endregion

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

   //Region Additional Charge Functions
 onAddtionalDDKeydown(event: any, rowindex: any) {
  console.log(rowindex);
    this.eAddCharge.toArray()[rowindex].nativeElement.value = "";
    this.eAddCharge.toArray()[rowindex].nativeElement.select();
    this.eAddCharge.toArray()[rowindex].nativeElement.focus();
  }
  onAddtionalAmountKeydown(event: any, rowindex: any) {  
    this.eAddGstDD.toArray()[rowindex].nativeElement.value = "";
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
      this.gstlistData.filteredData[i].accgsttotvalue = parseFloat(amount) + gstvalue;
    } 
    else 
    {
      var amount = this.gstlistData.filteredData[i].accvalue;
      this.gstlistData.filteredData[i].accgstvalue = 0;
      this.gstlistData.filteredData[i].accgsttotvalue = parseFloat(amount) ? parseFloat(amount) : 0;
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
}
