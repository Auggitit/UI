import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {
  Acc,
  Ledger,
  Product,
  SalesArray,
  Vendor,
  gst,
  gstdata,
  iaccounts,
  igstaccounts,
  iprodutcs,
  sref,
} from '../../SalesOrder/SalesOrderTS/SalesOrderInterface';
import { SalescusComponent } from '../../SalesOrder/SalesOrderHtml/Sales-Customer/salescus/salescus.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';
import { SsoService } from 'src/app/services/sso.service';
import { MatDialog } from '@angular/material/dialog';
import { PendingpoComponent } from 'src/app/vouchers/models/pendingpo/pendingpo.component';
import { Router } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { SoService } from 'src/app/services/so.service';
import { AdddelivaddressComponent } from 'src/app/vouchers/models/adddelivaddress/adddelivaddress.component';
import { ShowdelivaddressComponent } from 'src/app/vouchers/models/showdelivaddress/showdelivaddress.component';
import { ApiService } from 'src/app/services/api.service';
import { Guid } from 'guid-typescript';

export interface Cus {
  id: Guid;
  efieldname: string;
  efieldvalue: string;
  sono: string;
  sotype: string;
  RCreatedDateTime: Date;
  RStatus: string;
  company: string;
  branch: string;
  fy: string;
}

@Component({
  selector: 'app-sovoucher',
  templateUrl: './sovoucher.component.html',
  styleUrls: ['./sovoucher.component.scss'],
  providers: [SalesArray, SalescusComponent],
})
export class SovoucherComponent implements OnInit {
 
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
  loading: boolean = false;
  branch: any = '001';
  fy: any = '001';
  company: any = '001';
  fyname: any = '23-24';

  subinvno: any;
  subinvdate: any;
  tdstotal: any = 0.0;
  invoicecopy: any;
  salesDiscountAcc: any;
  transportAcc: any;
  packingAcc: any;
  insurenceAcc: any;
  tcsAcc: any;
  roundingAcc: any;
  

  constructor(
    public soapi: SsoService,
    public api:ApiService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public sales :SalesArray,
    public salesapi: SoService,
  ) 
  {
    this.setValidator();
  }

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

  sono: any;
  sodate: any;
  refno: any;
  salerefname: any;
  refSearch = new FormControl('');
  filteredSref!: Observable<sref[]>;
  salesRefArray: sref[] = [];
  btnsaleschange: boolean = false;
  //#endregion

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
  //Additional Charge
  @ViewChildren('eAddCharge') private eAddCharge!: QueryList<ElementRef>;  
  @ViewChildren('eAddGstDD') private eAddGstDD!: QueryList<ElementRef>;    
 
  gotolist() {
    this.router.navigateByUrl('sales-order-list');
  }

  ngOnInit(): void {
    this.sodate = new Date();
    this.getMaxInvoiceNo();  
    this.loadVendors();
    this.loadSaleRef();      
    this.addInitialRowProductTable();
    this.loadProducts();
    this.emptyrow();
    this.loadsdef();
    this.loadSavedAccounts();
    this.loadDefalutAccounts();
    this.gstArray.splice(0);
    this.gstArray.push({ gst: 'NO GST', hsn: '' });
    this.loadgst();
    this.loadgstwithvalue();
    this.calculate();
  }
  setValidator() {
    this.formGRN = this.fb.group({
      cpono: ['', [Validators.required]],
      cpodate: ['', [Validators.required]],
      crefno: ['', [Validators.nullValidator]],
      csrefno: ['', [Validators.required]],
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
      console.log(data);
      this.selectedvendor = data;
      this.vendorcode = data.LedgerCode.toString();
      this.vendorname = data.CompanyDisplayName;
      this.vendorgstno = data.GSTNo;
      this.vendorbilling = data.BilingAddress;
      this.vendorgstTreatment = data.GSTTreatment;
      this.vendorstate = data.StateName;
      this.vendorstatecode = data.stateCode;
      this.btnvendorchange = true;
      this.vendordelivery = data.DeliveryAddress;
      this.calculate();
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
    this.vendordelivery= '';
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
  ShowAddDelivery()
  {
    this.api.showDeliveryAddress(this.vendorcode).subscribe(res=>{         
        let dialogRef = this.dialog.open(ShowdelivaddressComponent,
        {
          // maxWidth: '90vw',
          // maxHeight: '90vh',
          // height: '55%',
          // width: '70%',
          // panelClass: 'full-screen-modal'
        });   
        dialogRef.componentInstance.data = JSON.parse(res);               
        dialogRef.afterClosed().subscribe(result=>{  
          this.vendordelivery = result.addr;
      });    
    })  
  }
  AddDelivery()
  {
    let dialogRef = this.dialog.open(AdddelivaddressComponent,
      {
        // maxWidth: '90vw',
        // maxHeight: '90vh',
        // height: '55%',
        // width: '70%',
        // panelClass: 'full-screen-modal'
      });   
    //dialogRef.componentInstance.data = "";               
    dialogRef.afterClosed().subscribe(result=>{  
      if(result != null)
      {
        this.saveDeliveryAddress(result);
      }
    });      
  }
  saveDeliveryAddress(addr:any)
  {
     var postdata={
      id: this.sales.getGUID(),
      company: this.company,
      ledgercode: this.vendorcode,
      deliveryAddress: addr
     }     
     this.api.Inser_DelivertAddress(postdata).subscribe(res=>{      
      this.vendordelivery = addr;     
      Swal.fire({
        icon: 'success',
        title:'Saved',
        text:'Address Saved!'
      })                              
     });   
  }
  //#endregion

  //#region Product Table functions
  addInitialRowProductTable() {
    of(this.sales.ELEMENT_DATA).subscribe(
      (data: iprodutcs[]) => {
        this.listData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  removeAllProducts() {
    this.listData.data.splice(0, this.listData.data.length);
    this.listData.data = [...this.listData.data]; // new ref!
    of(this.sales.ELEMENT_DATA).subscribe(
      (data: iprodutcs[]) => {
        this.listData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
    this.addNewRowProductTable();
    this.gstlistData.data.splice(0, this.gstlistData.data.length);
    this.gstlistData.data = [...this.gstlistData.data]; // new ref!
    of(this.sales.GST_DATA).subscribe(
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
  addNewRowProductTable() {
    return new Promise((resolve) => {
      const newRow = {
        id: this.sales.getGUID(),
        invno: '1',
        invdate: this.invdate,
        product: '',
        productcode: '',
        sku: '',
        hsn: '',
        godown: '',
        qty: 0,
        qtymt: 0,
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
        sotype:''
      };
      this.sales.ELEMENT_DATA.push(newRow);
      of(this.sales.ELEMENT_DATA).subscribe(
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
  removeProduct(index: any) {
    if (this.listData.data.length > 1) {
      this.listData.data.splice(index, 1);
      this.listData.data = [...this.listData.data]; // new ref!
      of(this.sales.ELEMENT_DATA).subscribe(
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

  //#region
  dataSource = this.sales.ELEMENT_DATA;
  sdef: any;
  subtotal: any = '0.00';
  additionalCharge: any = '0.00';
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
  vchtype: any = "SO";
  vchaccountcode: any;
  gstdata: gstdata[] = [];
  ledger: Ledger[] = [];
  cusFields: Cus[] = [];
  gstArray = [{ gst: '', hsn: '' }];
  invdate: Date = new Date();
  expdelidate: any;
  paymentTerm: any;
  vchaccount: any;
  
  listData!: MatTableDataSource<any>;
  prodArray: Product[] = [];

 
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
    // this.vendordiv = false;
    this.vchaccount = '';
    this.vendorname = '';
    this.expdelidate = undefined;
    this.paymentTerm = '';
    this.refno = '';
    this.remarks = '';
    this.termsandcondition = '';
    this.roundedoff = '0';
    this.tcsrate = '';
    this.tcsvalue = '';
    this.sdef.efieldvalue = '';
    this.removeAllProducts();
    this.calculate();
    this.loadsdef();
  }
  loadsdef() {
    return new Promise((resolve, reject) => {
      this.soapi.getDefSOFields().subscribe((res) => {
        this.sdef = res;
        resolve({ action: 'success' });
      });
    });
  }
 
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
        of(this.sales.ACC_DATA).subscribe(
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
    of(this.sales.ACC_DATA).subscribe(
      (data: iaccounts[]) => {
        this.acclistData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
    //this.addNewAccDataRow();
    console.log(this.acclistData.filteredData,"Remove All");
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
        this.sales.ACC_DATA.push(newRow);
        of(this.sales.ACC_DATA).subscribe(
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

  gstaddRow() {
    return new Promise((resolve) => {
      if( this.gstlistData.filteredData.length == 0)
      {
        const newRow = {
          acccode: '',
          accname: '',
          accvalue: '0',
          accgst: '0',
          accgstvalue: '0',
          accgsttotvalue: '0',
          hsn: '',
        };
        this.sales.GST_DATA.push(newRow);
        of(this.sales.GST_DATA).subscribe(
          (data: igstaccounts[]) => {
            this.gstlistData = new MatTableDataSource(data);
          },
          (error) => {
            console.log(error);
          }
        );
        this.loadgstwithvalue();
        resolve({ action: 'success' });
      }
      var checkEnpty = this.gstlistData.filteredData[this.gstlistData.filteredData.length-1].accname;
      if(checkEnpty != "")
      {
        const newRow = {
          acccode: '',
          accname: '',
          accvalue: '0',
          accgst: '0',
          accgstvalue: '0',
          accgsttotvalue: '0',
          hsn: '',
        };
        this.sales.GST_DATA.push(newRow);
        of(this.sales.GST_DATA).subscribe(
          (data: igstaccounts[]) => {
            this.gstlistData = new MatTableDataSource(data);
          },
          (error) => {
            console.log(error);
          }
        );
        this.loadgstwithvalue();
        resolve({ action: 'success' });
      }
    });    
  }

  loadgstwithvalue() {
    for (var i = 0; i < this.gstlistData.data.length; i++) {
      this.gstlistData.filteredData[i].accgst = 'NO GST';      
    }
  }

  gstremove(index: any) {
    //if (this.gstlistData.data.length > 1) {
      this.gstlistData.data.splice(index, 1);
      this.gstlistData.data = [...this.gstlistData.data]; // new ref!
      of(this.sales.GST_DATA).subscribe(
        (data: igstaccounts[]) => {
          this.gstlistData = new MatTableDataSource(data);
        },
        (error) => {
          console.log(error);
        }
      );
      this.calculate();
    //}
  }
  gstaccChanged(event: any, data: any, rowindex: any) {
    if (event.isUserInput == true) {
      this.gstlistData.filteredData[rowindex].acccode = data.ledgercode;
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

  //#region Products
  loadProducts() {
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
    });
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
  onProdKeydown(event: any, rowindex: any) {
    this.eqty.toArray()[rowindex].nativeElement.value = "";
    this.eqty.toArray()[rowindex].nativeElement.select();
    this.eqty.toArray()[rowindex].nativeElement.focus();
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
  //end region

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

    console.log(this.gstlistData.filteredData,"NO GST");
    for (let i = 0; i < this.gstlistData.filteredData.length; i++) {

      this.gstlistData.filteredData[i].accgst = 'NO GST';
      this.gstlistData.filteredData[i].accgsttotvalue = this.gstlistData.filteredData[i].accvalue;
      this.gstlistData.filteredData[i].accgstvalue = "0";      
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
      this.addNewRowProductTable().then((res) => {
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
  filteredDef: any[] = [];
  defaultAccounts: Acc[] = [];
  status: any = 'A';
  filterDefAccounts(event: any) {
    let name = event.target.value;
    this.filteredDef = name
      ? this.defaultAccounts.filter((accs) =>
          accs.ledgername.toLowerCase().includes(name.toLowerCase())
        )
      : this.defaultAccounts;
  }
  loadDefalutAccounts() {
    this.soapi.getDefaultAccounts().subscribe((res) => {
      this.defaultAccounts = JSON.parse(res);
      this.filteredDef = this.defaultAccounts;
    });
  }

  emptyrow() {
    of(this.sales.ACC_DATA).subscribe(
      (data: iaccounts[]) => {
        this.acclistData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
    //Add Empty Line to GST Accounts GRIDks
    of(this.sales.GST_DATA).subscribe(
      (data: igstaccounts[]) => {
        this.gstlistData = new MatTableDataSource(data);
        // console.log(this.gstlistData);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  loadgst() {
    this.soapi.getGstAccounts().subscribe((res) => {
      this.array = res;
      console.log(this.array,"GST ARRAYS");
    });
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
  loadSavedAccounts()
  {
    this.salesapi.getSavedAccounts().subscribe((res) => {
        console.log(res);   
        this.salesDiscountAcc = res[0].discAcc;
        this.transportAcc = res[0].tranAcc;
        this.packingAcc = res[0].packAcc;
        this.insurenceAcc = res[0].insuAcc;
        this.tcsAcc = res[0].tcsAcc;   
        this.roundingAcc = res[0].rounding;      
    });
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

  Vprefix:any="SO";
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
    if (this.sono != undefined && this.sono != '') {
      if (this.sodate == '' || this.sodate == undefined) {
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
    if (this.vendordelivery == '' || this.vendordelivery == undefined) {
      Swal.fire({
        icon: 'info',
        title: 'Delivery Address Need!',
        text: 'Please Select Delivery Address!',
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
  submit() {
    this.calculate();    
    setTimeout(() => {
      var res = this.validate();
      if (res == true) {
        if (this.formGRN.valid) {
          this.loading = true;
          this.getMaxInvoiceNo().then(() => {
            this.insertGrn().then(() => {
                this.insertCustomFields().then(() => {
                  this.insertGrnDetails().then(() => {
                    this.showSuccessMsg();
                  });
                });
            });
          });
        }
      }
    },100);
  }
  showSuccessMsg() {
    let dialogRef = this.dialog.open(SuccessmsgComponent, {
      //width: '350px',
      data: 'Voucher Successfully Saved!',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loading = false;
      this.clear();
      //this.eitemname?.nativeElement.focus();
    });
  }
  
  ssid:any;
  vendordelivery: any;
  getMaxInvoiceNo() {
    return new Promise((resolve) => {
      this.salesapi
        .getMaxInvoiceNo(
          this.vchtype,
          this.branch,
          this.fy,
          this.fyname,
          this.Vprefix
        )
        .subscribe((res) => {
          this.sono = res.invNo;
          this.ssid = res.invNoId;
          resolve({ action: 'success' });
        });
    });
  }
  insertGrn() {
    return new Promise((resolve) => {
      var postData = {
        id : this.sales.getGUID(),      
        sono : this.sono,
        sodate : this.sodate,
        company : this.company,
        branch : this.branch,
        fy : this.fy,
        refno : this.refno,
        customercode : this.vendorcode.toString(),
        customername : this.vendorname,    
        expDeliveryDate : this.expdelidate,
        payTerm : this.paymentTerm,
        remarks : this.remarks,
        termsandcondition :this.termsandcondition,
        invoicecopy : this.invoicecopy,
        subTotal : this.subtotal,
        discountTotal :this.disctotal,
        cgstTotal : this.cgsttotal,
        sgstTotal : this.sgsttotal,
        igstTotal : this.igsttotal,        
        roundedoff : this.roundedoff,
        net : this.nettotal,
        rCreatedDateTime : new Date,
        rStatus: 'A',
        // trRate: this.tpRate,
        // trValue : this.tpValue,        
        // pkRate : this.pkRate,
        // pkValue : this.pkValue,
        // inRate : this.insRate,
        // inValue: this.insValue,
        tcsRate : this.tcsrate,
        tcsValue : this.tcsvalue,
        sotype : this.vchtype,
        soid:this.ssid,
        closingValue:this.closingtotal,
        salerefname: this.salerefname,
        deliveryaddress : this.vendordelivery
      };
      this.salesapi.Insert_SO(postData).subscribe((res) => {
        resolve({ action: 'success' });
      });
    });
  }
  insertGrnDetails() {
    return new Promise((resolve) => { 
      this.dataSource.forEach(element => {
        element.sono = this.sono.toString(),
        element.sodate = this.sodate,
        element.id = this.sales.getGUID(),
        element.company = this.company,
        element.branch = this.branch,
        element.fy = this.fy,
        element.customercode = this.vendorcode.toString()
         element.sotype = this.vchtype
      });     
      this.dataSource.forEach((element, index) => {
        var amount = element.amount;
        if(amount === 0)
        {
          this.dataSource.splice(index,1);
        }
      });     
      this.salesapi.Insert_Bulk_SO_Details(this.dataSource).subscribe(res=>{                             
        resolve({ action: 'success' });
      });   
    });
  }
  insertCustomFields() {
    return new Promise((resolve) => {
      for (let i = 0; i < this.sdef.length; i++) {
        var postdata = {
          id: this.sales.getGUID(),
          efieldname: this.sdef[i].efieldname,
          efieldvalue: this.sdef[i].efieldvalue,
          sono: this.sono.toString(),
          sotype : this.vchtype,
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

  //insert Other Ledger
  //#endregion
}
