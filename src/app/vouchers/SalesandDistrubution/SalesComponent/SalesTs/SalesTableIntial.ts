import { Guid } from 'guid-typescript';
import { SalesInitial } from './SalesInitial';
import { MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';
import { Acc } from 'src/app/Component/Interface/all-interface';
import { SalesshareService } from '../SalesService/salesshare.service';
export interface iaccounts {
  acccode:string;
  accname:string;
  accvalue:string;
  acckey:string;
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

export class salestable {
  

 constructor() {

 }
  salesintial: any = new SalesInitial();

 vendorstatecode:any;
  ACC_DATA: iaccounts[] = [
    {
      acccode:'',
      accname:'',
      accvalue:'',
      acckey:'',
    }
  ]  
  GST_DATA: igstaccounts[] = [
    {
      acccode: '',
      accname: '',
      accvalue: '',
      accgst: '',
      accgstvalue: '',
      accgsttotvalue: '',
      hsn: '',
    },
  ];
  previous: any = {
    data: [] 
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
      id: this.salesintial.getGUID(),
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
    // this.erate.toArray()[rowindex].nativeElement.select();
    // this.erate.toArray()[rowindex].nativeElement.focus();
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
    // this.edisc.toArray()[rowindex].nativeElement.select();
    // this.edisc.toArray()[rowindex].nativeElement.focus();
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
    // this.etax.toArray()[rowindex].nativeElement.select();
    // this.etax.toArray()[rowindex].nativeElement.focus();
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
    // this.eamt.toArray()[rowindex].nativeElement.focus();

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

    for (let i = 0; i < this.gstlistData.filteredData.length; i++) {
      this.gstlistData.filteredData[i].accgst = 'NO GST';
      this.gstlistData.filteredData[i].accgsttotvalue;
      this.gstlistData.filteredData[i].accvalue;
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
    // if (rowindex + 1 == this.listData.data.length) {
    //   this.addRow().then((res) => {
    //     setTimeout(() => {
    //       this.eprod.toArray()[rowindex + 1].nativeElement.select();
    //       this.eprod.toArray()[rowindex + 1].nativeElement.focus();
    //     }, 500);
    //   });
    // } else {
    //   this.eprod.toArray()[rowindex + 1].nativeElement.select();
    //   this.eprod.toArray()[rowindex + 1].nativeElement.focus();
    // }
    // this.calculate();
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
  }
  //#endregion
  //#endregion
  
  //#region sales-layout-end
  sdef: any;
  subtotal:any = '0.00';
  disctotal:any;
  nettotal:any;
  tdsper:any;
  roundedoff:any;
  subwithoutcharges:any;
  array: gst[] = [];
  acclistData!: MatTableDataSource<any>;
  gstlistData!: MatTableDataSource<any>;
  cgsttotal:any;
  sgsttotal:any;
  igsttotal:any;
  tcsrate:any;
  tcsvalue:any;
  closingtotal:any;
  remarks:any;
  termsandcondition:any;
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
      var obj = this.acclistData.filteredData.find((o) => o.acckey === akey);
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
      // this.loadgstwithvalue();
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
    this.disctotal = 0.0;
    this.nettotal = 0.0;
    var gstAmount = 0.0;
    var igst0 = 0.0;
    var igst5 = 0.0;
    var igst12 = 0.0;
    var igst18 = 0.0;
    var igst28 = 0.0;
    var cgst0 = 0.0;
    var cgst2p5 = 0.0;
    var cgst6 = 0.0;
    var cgst9 = 0.0;
    var cgst14 = 0.0;
    var sgst0 = 0.0;
    var sgst2p5 = 0.0;
    var sgst6 = 0.0;
    var sgst9 = 0.0;
    var sgst14 = 0.0;
    //#endregion
  console.log("array",this.vendorstatecode)
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
      this.subwithoutcharges = sub + listsub
      var dis = isNaN(parseFloat(this.disctotal))
        ? 0
        : parseFloat(this.disctotal);
      var dislist = isNaN(parseFloat(this.listData.filteredData[i].discvalue))
        ? 0
        : parseFloat(this.listData.filteredData[i].discvalue);
      this.disctotal = dis + dislist;

      if (this.vendorstatecode == '33') {
        var __gst = this.listData.filteredData[i].gst;
        var __gstvalue = this.listData.filteredData[i].gstvalue;
        if (parseFloat(__gst) == 0) {
          var CKEY = 'CGST 0';
          var SKEY = 'SGST 0';
          cgst0 = cgst0 + 0;
          sgst0 = sgst0 + 0;
          var fac = this.array.find(
            (o: { ledgername: string }) => o.ledgername === CKEY
          );
          this.addAccDataRow(fac?.ledgercode, CKEY, cgst0, CKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === CKEY)
            )
          ].accvalue = cgst0;
          var fas = this.array.find(
            (o: { ledgername: string }) => o.ledgername === SKEY
          );
          this.addAccDataRow(fas?.ledgercode, SKEY, sgst0, SKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === SKEY)
            )
          ].accvalue = sgst0;
        }
        if (parseFloat(__gst) == 5) {
          var CKEY = 'CGST 2.5';
          var SKEY = 'SGST 2.5';
          cgst2p5 = cgst2p5 + parseFloat(__gstvalue) / 2;
          sgst2p5 = sgst2p5 + parseFloat(__gstvalue) / 2;
          var fac = this.array.find(
            (o: { ledgername: string }) => o.ledgername === CKEY
          );
          this.addAccDataRow(fac?.ledgercode, CKEY, cgst2p5, CKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === CKEY)
            )
          ].accvalue = cgst2p5;
          var fas = this.array.find(
            (o: { ledgername: string }) => o.ledgername === SKEY
          );
          this.addAccDataRow(fas?.ledgercode, SKEY, sgst2p5, SKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === SKEY)
            )
          ].accvalue = sgst2p5;
        }
        if (parseFloat(__gst) == 12) {
          var CKEY = 'CGST 6';
          var SKEY = 'SGST 6';
          cgst6 = cgst6 + parseFloat(__gstvalue) / 2;
          sgst6 = sgst6 + parseFloat(__gstvalue) / 2;
          var fac = this.array.find(
            (o: { ledgername: string }) => o.ledgername === CKEY
          );
          this.addAccDataRow(fac?.ledgercode, CKEY, cgst6, CKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === CKEY)
            )
          ].accvalue = cgst6;
          var fas = this.array.find(
            (o: { ledgername: string }) => o.ledgername === SKEY
          );
          this.addAccDataRow(fas?.ledgercode, SKEY, sgst6, SKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === SKEY)
            )
          ].accvalue = sgst6;
        }
        if (parseFloat(__gst) == 18) {
          var CKEY = 'CGST 9';
          var SKEY = 'SGST 9';
          cgst9 = cgst9 + parseFloat(__gstvalue) / 2;
          sgst9 = sgst9 + parseFloat(__gstvalue) / 2;
          var fac = this.array.find(
            (o: { ledgername: string }) => o.ledgername === CKEY
          );
          this.addAccDataRow(fac?.ledgercode, CKEY, cgst9.toFixed(2), CKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === CKEY)
            )
          ].accvalue = cgst9;
          var fas = this.array.find(
            (o: { ledgername: string }) => o.ledgername === SKEY
          );
          this.addAccDataRow(fas?.ledgercode, SKEY, sgst9.toFixed(2), SKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === SKEY)
            )
          ].accvalue = sgst9;
        }
        if (parseFloat(__gst) == 28) {
          var CKEY = 'CGST 14';
          var SKEY = 'SGST 14';
          cgst14 = cgst14 + parseFloat(__gstvalue) / 2;
          sgst14 = sgst14 + parseFloat(__gstvalue) / 2;
          var fac = this.array.find(
            (o: { ledgername: string }) => o.ledgername === CKEY
          );
          this.addAccDataRow(fac?.ledgercode, CKEY, cgst14, CKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === CKEY)
            )
          ].accvalue = cgst14;
          var fas = this.array.find(
            (o: { ledgername: string }) => o.ledgername === SKEY
          );
          this.addAccDataRow(fas?.ledgercode, SKEY, sgst14, SKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === SKEY)
            )
          ].accvalue = sgst14;
        }
      } else if (this.vendorstatecode != '33') {
        var __gst = this.listData.filteredData[i].gst;
        var __gstvalue = this.listData.filteredData[i].gstvalue;
        if (parseFloat(__gst) == 0) {
          var KEY = 'IGST 0';
          igst0 = igst0 + 0;
          var fa = this.array.find(
            (o: { ledgername: string }) => o.ledgername === KEY
          );
          this.addAccDataRow(fa?.ledgercode, KEY, igst0, KEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === KEY)
            )
          ].accvalue = igst0;
        }
        if (parseFloat(__gst) == 5) {
          var KEY = 'IGST 5';
          igst5 = igst5 + parseFloat(__gstvalue);
          var fa = this.array.find(
            (o: { ledgername: string }) => o.ledgername === KEY
          );
          this.addAccDataRow(fa?.ledgercode, KEY, igst5, KEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === KEY)
            )
          ].accvalue = igst5;
        }
        if (parseFloat(__gst) == 12) {
          var KEY = 'IGST 12';
          igst12 = igst12 + parseFloat(__gstvalue);
          var fa = this.array.find(
            (o: { ledgername: string }) => o.ledgername === KEY
          );
          this.addAccDataRow(fa?.ledgercode, KEY, igst12, KEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === KEY)
            )
          ].accvalue = igst12;
        }
        if (parseFloat(__gst) == 18) {
          var KEY = 'IGST 18';
          igst18 = igst18 + parseFloat(__gstvalue);
          var fa = this.array.find(
            (o: { ledgername: string }) => o.ledgername === KEY
          );
          this.addAccDataRow(fa?.ledgercode, KEY, igst18, KEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === KEY)
            )
          ].accvalue = igst18;
        }
        if (parseFloat(__gst) == 28) {
          var KEY = 'IGST 28';
          igst28 = igst28 + parseFloat(__gstvalue);
          var fa = this.array.find(
            (o: { ledgername: string }) => o.ledgername === KEY
          );
          this.addAccDataRow(fa?.ledgercode, KEY, igst28, KEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === KEY)
            )
          ].accvalue = igst28;
        }
      }
      gstAmount =
        gstAmount + parseFloat(this.listData.filteredData[i].gstvalue);
    }
    for (let i = 0; i < this.gstlistData.filteredData.length; i++) {
      if (this.vendorstatecode == '33') {
        var __gst = this.gstlistData.filteredData[i].accgst;
        var __gstvalue = this.gstlistData.filteredData[i].accgstvalue;
        var __gst = isNaN(parseFloat(__gst)) ? '0' : __gst;
        if (parseFloat(__gst) == 0) {
          var CKEY = 'CGST 0';
          var SKEY = 'SGST 0';
          cgst0 = cgst0 + 0;
          sgst0 = sgst0 + 0;
          var fac = this.array.find(
            (o: { ledgername: string }) => o.ledgername === CKEY
          );
          this.addAccDataRow(fac?.ledgercode, CKEY, cgst0, CKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === CKEY)
            )
          ].accvalue = cgst0;
          var fas = this.array.find(
            (o: { ledgername: string }) => o.ledgername === SKEY
          );
          this.addAccDataRow(fas?.ledgercode, SKEY, sgst0, SKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === SKEY)
            )
          ].accvalue = sgst0;
        }
        if (parseFloat(__gst) == 5) {
          var CKEY = 'CGST 2.5';
          var SKEY = 'SGST 2.5';
          cgst2p5 = cgst2p5 + parseFloat(__gstvalue) / 2;
          sgst2p5 = sgst2p5 + parseFloat(__gstvalue) / 2;
          var fac = this.array.find(
            (o: { ledgername: string }) => o.ledgername === CKEY
          );
          this.addAccDataRow(fac?.ledgercode, CKEY, cgst2p5, CKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === CKEY)
            )
          ].accvalue = cgst2p5;
          var fas = this.array.find(
            (o: { ledgername: string }) => o.ledgername === SKEY
          );
          this.addAccDataRow(fas?.ledgercode, SKEY, sgst2p5, SKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === SKEY)
            )
          ].accvalue = sgst2p5;
        }
        if (parseFloat(__gst) == 12) {
          var CKEY = 'CGST 6';
          var SKEY = 'SGST 6';
          cgst6 = cgst6 + parseFloat(__gstvalue) / 2;
          sgst6 = sgst6 + parseFloat(__gstvalue) / 2;
          var fac = this.array.find(
            (o: { ledgername: string }) => o.ledgername === CKEY
          );
          this.addAccDataRow(fac?.ledgercode, CKEY, cgst6, CKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === CKEY)
            )
          ].accvalue = cgst6;
          var fas = this.array.find(
            (o: { ledgername: string }) => o.ledgername === SKEY
          );
          this.addAccDataRow(fas?.ledgercode, SKEY, sgst6, SKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === SKEY)
            )
          ].accvalue = sgst6;
        }
        if (parseFloat(__gst) == 18) {
          var CKEY = 'CGST 9';
          var SKEY = 'SGST 9';
          cgst9 = cgst9 + parseFloat(__gstvalue) / 2;
          sgst9 = sgst9 + parseFloat(__gstvalue) / 2;
          var fac = this.array.find(
            (o: { ledgername: string }) => o.ledgername === CKEY
          );
          this.addAccDataRow(fac?.ledgercode, CKEY, cgst9.toFixed(2), CKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === CKEY)
            )
          ].accvalue = cgst9;
          var fas = this.array.find(
            (o: { ledgername: string }) => o.ledgername === SKEY
          );
          this.addAccDataRow(fas?.ledgercode, SKEY, sgst9.toFixed(2), SKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === SKEY)
            )
          ].accvalue = sgst9;
        }
        if (parseFloat(__gst) == 28) {
          var CKEY = 'CGST 14';
          var SKEY = 'SGST 14';
          cgst14 = cgst14 + parseFloat(__gstvalue) / 2;
          sgst14 = sgst14 + parseFloat(__gstvalue) / 2;
          var fac = this.array.find(
            (o: { ledgername: string }) => o.ledgername === CKEY
          );
          this.addAccDataRow(fac?.ledgercode, CKEY, cgst14, CKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === CKEY)
            )
          ].accvalue = cgst14;
          var fas = this.array.find(
            (o: { ledgername: string }) => o.ledgername === SKEY
          );
          this.addAccDataRow(fas?.ledgercode, SKEY, sgst14, SKEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === SKEY)
            )
          ].accvalue = sgst14;
        }
      } else if (this.vendorstatecode != '33') {
        var __gst = this.gstlistData.filteredData[i].accgst;
        var __gstvalue = this.gstlistData.filteredData[i].accgstvalue;
        var __gst = isNaN(parseFloat(__gst)) ? '0' : __gst;
        if (parseFloat(__gst) == 0) {
          var KEY = 'IGST 0';
          igst0 = igst0 + 0;
          var fa = this.array.find(
            (o: { ledgername: string }) => o.ledgername === KEY
          );
          this.addAccDataRow(fa?.ledgercode, KEY, igst0, KEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === KEY)
            )
          ].accvalue = igst0;
        }
        if (parseFloat(__gst) == 5) {
          var KEY = 'IGST 5';
          igst5 = igst5 + parseFloat(__gstvalue);
          var fa = this.array.find(
            (o: { ledgername: string }) => o.ledgername === KEY
          );
          this.addAccDataRow(fa?.ledgercode, KEY, igst5, KEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === KEY)
            )
          ].accvalue = igst5;
        }
        if (parseFloat(__gst) == 12) {
          var KEY = 'IGST 12';
          igst12 = igst12 + parseFloat(__gstvalue);
          var fa = this.array.find(
            (o: { ledgername: string }) => o.ledgername === KEY
          );
          this.addAccDataRow(fa?.ledgercode, KEY, igst12, KEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === KEY)
            )
          ].accvalue = igst12;
        }
        if (parseFloat(__gst) == 18) {
          var KEY = 'IGST 18';
          igst18 = igst18 + parseFloat(__gstvalue);
          var fa = this.array.find(
            (o: { ledgername: string }) => o.ledgername === KEY
          );
          this.addAccDataRow(fa?.ledgercode, KEY, igst18, KEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === KEY)
            )
          ].accvalue = igst18;
        }
        if (parseFloat(__gst) == 28) {
          var KEY = 'IGST 28';
          igst28 = igst28 + parseFloat(__gstvalue);
          var fa = this.array.find(
            (o: { ledgername: string }) => o.ledgername === KEY
          );
          this.addAccDataRow(fa?.ledgercode, KEY, igst28, KEY);
          this.acclistData.filteredData[
            this.acclistData.filteredData.indexOf(
              this.acclistData.filteredData.find((o) => o.acckey === KEY)
            )
          ].accvalue = igst28;
        }
      }
      gstAmount =
        gstAmount + parseFloat(this.gstlistData.filteredData[i].accgstvalue);
    }
    for (let i = 0; i < this.gstlistData.filteredData.length; i++) {
      let val = this.gstlistData.filteredData[i].accvalue;
      if (val == '' || val == undefined) {
        val = '0';
      }
      this.subtotal = this.subtotal + parseFloat(val);

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
    if (this.disctotal == '' || this.disctotal == undefined) {
      this.disctotal = '0';
    }
    if (gstAmount == undefined || gstAmount == null || isNaN(gstAmount)) {
      gstAmount = 0;
    }
    this.nettotal =
      parseFloat(this.subtotal) - parseFloat(this.disctotal) + gstAmount;
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
    this.closingtotal =
      parseFloat(this.closingtotal) + parseFloat(this.roundedoff);
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
}
