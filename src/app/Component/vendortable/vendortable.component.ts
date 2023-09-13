import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Product, iprodutcs } from '../Interface/all-interface';
import { of } from 'rxjs';
import { Arrays } from '../Interface/all-interface';
import { GrnserviceService } from 'src/app/services/grnservice.service';
import { Methods } from '../Interface/globalmethod';
@Component({
  selector: 'app-vendortable',
  templateUrl: './vendortable.component.html',
  styleUrls: ['./vendortable.component.scss']
})
export class VendortableComponent implements OnInit {

  @ViewChildren('eqty') private eqty!: QueryList<ElementRef>;
  @ViewChildren('erate') private erate!: QueryList<ElementRef>;
  @ViewChildren('edisc') private edisc!: QueryList<ElementRef>;
  @ViewChildren('etax') private etax!: QueryList<ElementRef>;
  @ViewChildren('eamt') private eamt!: QueryList<ElementRef>;
  @ViewChildren('eprod') private eprod!: QueryList<ElementRef>;

  constructor( public grnapi: GrnserviceService,
    
    
    ) { }
  ngOnInit(): void {

    this.loadProducts();
    this.emptyrowonload();
  }
  emptyrowonload() {
    //Add Empty Line to data GRID
    of(this.elementData).subscribe(
      (data: iprodutcs[]) => {
        this.listData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
    // //Add Empty Line to Accounts GRID
    // of(this.ACC_DATA).subscribe(
    //   (data: iaccounts[]) => {
    //     this.acclistData = new MatTableDataSource(data);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
    // //Add Empty Line to GST Accounts GRID
    // of(this.GST_DATA).subscribe(
    //   (data: igstaccounts[]) => {
    //     this.gstlistData = new MatTableDataSource(data);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }
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
  listData!: MatTableDataSource<any>;

  methods: any = new Methods();
  arrays:any  = new Arrays();
  elementData:any = this.arrays.ELEMENT_DATA;

  //#region Product
  loadProducts() {
    this.grnapi.getProducts().subscribe((res) => {
      this.prodArray = res;
      
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
      this.listData.filteredData[rowindex].uom = data.uomname;
      // console.log(data);
      //console.log(this.listData.filteredData);
    }
  }
  //#endregion

  
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
    // this.onCalculation(qty, rate, disc, gst, rowindex);
    // this.calculate();
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
    // this.onCalculation(qty, rate, disc, gst, rowindex);
    // this.calculate();
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
    // this.onCalculation(qty, rate, disc, gst, rowindex);
    // this.calculate();
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
    // this.onCalculation(qty, rate, disc, gst, rowindex);
    // this.calculate();
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
    // this.onCalculation(qty, rate, disc, gst, rowindex);
    // this.calculate();
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
    // this.onCalculation(qty, rate, disc, gst, rowindex);
    // this.calculate();
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
    // this.onCalculation(qty, rate, disc, gst, rowindex);
    // this.calculate();
  }
  //#region  on tax
  onTaxKeydown(event: any, rowindex: any) {
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
    // this.onCalculation(qty, rate, disc, gst, rowindex);
    // this.calculate();
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

    // for (let i = 0; i < this.gstlistData.filteredData.length; i++) {
    //   this.gstlistData.filteredData[i].accgst = 'NO GST';
    //   this.gstlistData.filteredData[i].accgsttotvalue;
    //   this.gstlistData.filteredData[i].accvalue;
    // }
    // this.calculate();
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
    // this.onCalculation(qty, rate, disc, gst, rowindex);
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


  addRow() {
    return new Promise((resolve) => {
      const newRow = {
        id: this.arrays.getGUID(),
        grnno: '1',
        // grndate: this.invdate,
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
        vchtype: '',
      };
      this.elementData.push(newRow);

      of(this.elementData).subscribe(
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
    of(this.elementData).subscribe(
      (data: iprodutcs[]) => {
        this.listData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
    this.addRow();
    // this.gstlistData.data.splice(0, this.gstlistData.data.length);
    // this.gstlistData.data = [...this.gstlistData.data]; // new ref!
    // of(this.GST_DATA).subscribe(
    //   (data: igstaccounts[]) => {
    //     this.gstlistData = new MatTableDataSource(data);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
    // this.gstaddRow();
    // this.calculate();
  }
  remove(index: any) {
   
    if (this.listData.data.length > 1) {
      this.listData.data.splice(index, 1);
      this.listData.data = [...this.listData.data]; // new ref!
      of(this.elementData).subscribe(
        (data: iprodutcs[]) => {
          this.listData = new MatTableDataSource(data);
        },
        (error) => {
          console.log(error);
        }
      );
      //this.calculate();
    }
  }

}
