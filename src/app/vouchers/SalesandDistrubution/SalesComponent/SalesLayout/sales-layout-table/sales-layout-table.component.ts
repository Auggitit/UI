import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { of } from 'rxjs';

import { SsalesService } from 'src/app/services/ssales.service';
import {
  iaccounts,
  igstaccounts,
  iprodutcs,
  salestable,
} from '../../SalesTs/SalesTableIntial';
import { SsoService } from 'src/app/services/sso.service';
import { SalesshareService } from '../../SalesService/salesshare.service';

@Component({
  selector: 'app-sales-layout-table',
  templateUrl: './sales-layout-table.component.html',
  styleUrls: ['./sales-layout-table.component.scss'],
})
export class SalesLayoutTableComponent implements OnInit {
  @ViewChildren('eprod') private eprod!: QueryList<ElementRef>;
  @ViewChildren('egodown') private egodown!: QueryList<ElementRef>;
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


  constructor(public salesapi: SsalesService, public sales: SsoService,public ser:SalesshareService) {}
  variables: any = new salestable();
  ngOnInit(): void {
    this.addemptyrow();
    this.loadProducts();
    this.emptyrow();
    this.loadsdef();
    this.loadDefalutAccounts();
    this.variables.gstArray.splice(0);
    this.variables.gstArray.push({ gst: 'NO GST', hsn: '' });
    this.loadgst();
    this.loadgstwithvalue();
    console.log(this.ser.vendorstatecode);
    this.variables.vendorstatecode = this.ser.vendorstatecode;
  }
  addemptyrow() {
    of(this.variables.ELEMENT_DATA).subscribe(
      (data: iprodutcs[]) => {
        this.variables.listData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onProdKeydown(event: any, rowindex: any) {
    //this.egodown.toArray()[rowindex].nativeElement.value = "";
    // this.egodown.toArray()[rowindex].nativeElement.select();
    // this.egodown.toArray()[rowindex].nativeElement.focus();
  }
  loadProducts() {
    this.salesapi.getProducts().subscribe((res) => {
      this.variables.prodArray = res;
    });
  }
  filterProducts(name: string) {
    return (
      (name &&
        this.variables.prodArray.filter((items: { itemname: string }) =>
          items.itemname.toLowerCase().includes(name?.toLowerCase())
        )) ||
      this.variables.prodArray
    );
  }
  prodChanged(event: any, data: any, rowindex: any) {
    if (event.isUserInput == true) {
      console.log(rowindex);
      console.log(data);
      console.log(this.variables.listData);
      console.log(data.itemname);
      this.variables.listData.filteredData[rowindex].product =
        data.itemname.toString();
      this.variables.listData.filteredData[rowindex].productcode =
        data.itemcode.toString();
      this.variables.listData.filteredData[rowindex].sku = data.itemsku;
      this.variables.listData.filteredData[rowindex].hsn = data.itemhsn;
      console.log(this.variables.listData);
      console.log(this.variables.listData.filteredData[rowindex].product);
      console.log(this.variables.listData);
      // this.egodown.toArray()[rowindex].nativeElement.value = "";
      // this.egodown.toArray()[rowindex].nativeElement.focus();
    }
  }

  loadsdef() {
    return new Promise((resolve, reject) => {
      this.sales.getDefSOFields().subscribe((res) => {
        this.variables.sdef = res;
        resolve({ action: 'success' });
      });
    });
  }
  loadDefalutAccounts() {
    this.sales.getDefaultAccounts().subscribe((res) => {
      this.variables.defaultAccounts = JSON.parse(res);
      this.variables.filteredDef = this.variables.defaultAccounts;
    });
  }
  emptyrow() {
    of(this.variables.ACC_DATA).subscribe(
      (data: iaccounts[]) => {
        this.variables.acclistData = new MatTableDataSource(data);
      },
      (error) => {
        console.log(error);
      }
    );
    //Add Empty Line to GST Accounts GRIDks
    of(this.variables.GST_DATA).subscribe(
      (data: igstaccounts[]) => {
        this.variables.gstlistData = new MatTableDataSource(data);
        console.log(this.variables.gstlistData);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  loadgstwithvalue() {
    for (var i = 0; i < this.variables.gstlistData.data.length; i++) {
      this.variables.gstlistData.filteredData[i].accgst = 'NO GST';
    }
  }
  loadgst() {
    this.sales.getGstAccounts().subscribe((res) => {
      this.variables.array = res;
      console.log(this.variables.array)
    });
  }
}
