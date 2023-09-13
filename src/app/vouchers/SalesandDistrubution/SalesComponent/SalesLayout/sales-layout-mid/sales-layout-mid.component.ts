import { Component, OnInit } from '@angular/core';
import { map, startWith } from 'rxjs';
import { SalesInitial, Vendor, sref } from '../../SalesTs/SalesInitial';
import { SsalesService } from 'src/app/services/ssales.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SsoService } from 'src/app/services/sso.service';
import { SalesshareService } from '../../SalesService/salesshare.service';


@Component({
  selector: 'app-sales-layout-mid',
  templateUrl: './sales-layout-mid.component.html',
  styleUrls: ['./sales-layout-mid.component.scss'],
})
export class SalesLayoutMidComponent implements OnInit {
  form!: FormGroup;
  constructor(public salesapi: SsalesService, public soapi: SsoService,public ser:SalesshareService) {
    this.form = new FormGroup({
      vendor: new FormControl(),
      edate: new FormControl(),
      pterms: new FormControl(),
      ref: new FormControl(),
      sref: new FormControl(),
    });
  }
  variables: any = new SalesInitial();

  ngOnInit(): void {
    // this.form = this.rootForm.control;

    this.loadCustomers();
    this.loadSaleRef();
  }
  loadCustomers() {
    this.salesapi.getCustomers().subscribe((res) => {
      this.variables.vendorsArray = JSON.parse(res);
      this.variables.filteredVendors =
        this.variables.vendorSearch.valueChanges.pipe(
          startWith(''),
          map((vendor) =>
            vendor
              ? this._filtercustomers(vendor)
              : this.variables.vendorsArray.slice()
          )
        );
    });
  }
  private _filtercustomers(value: any): Vendor[] {
    const filterValue = value.toLowerCase();
    return this.variables.vendorsArray.filter((vendor: any) =>
      vendor.CompanyDisplayName.toLowerCase().includes(filterValue)
    );
  }
  vendorChanged(event: any, data: any) {
    if (event.isUserInput == true) {
      this.salesapi
        .getPendingSOListDetails(data.LedgerCode)
        .subscribe((res) => {
          this.variables.vendorpodatacount = res.length;
          this.variables.vendorpodata = res;
        });
      this.variables.selectedvendor = data;
      this.variables.vendorcode = data.LedgerCode.toString();
      this.variables.vendorname = data.CompanyDisplayName;
      this.variables.vendorgstno = data.GSTNo;
      this.variables.vendorbilling = data.BilingAddress;
      this.variables.vendordelivery = data.DeliveryAddress;
      this.variables.vendorgstTreatment = data.GSTTreatment;
      this.variables.vendorstate = data.StateName;
      this.variables.vendorstatecode = data.stateCode;
    this.ser.vendorstatecode = this.variables.vendorstatecode
      // this.initial.calculate();
    }
  }
  getPayTerm(event: any) {
    this.variables.paymentTerm = event.source.triggerValue;
  }
 
  //#region saelsref
  loadSaleRef() {
    this.soapi.get_SaleRef().subscribe((res) => {
      this.variables.salesRefArray = res;
      console.log(this.variables.salesRefArray);
      this.variables.filteredSref = this.variables.refSearch.valueChanges.pipe(
        startWith(''),
        map((vendor) =>
          vendor
            ? this._filterref(vendor)
            : this.variables.salesRefArray.slice()
        )
      );
    });
  }
  private _filterref(value: any): sref[] {
    const filterValue = value.toLowerCase();
    return this.variables.salesRefArray.filter((vendor: any) =>
      vendor.refname.toLowerCase().includes(filterValue)
    );
  }
  changeRef()
  {
    this.variables.salerefname = "";         
  }
  SaleRefChanged(event: any, data: any) {
    this.variables.salerefname = data.refname;
  }
  //#endregion

}

// ,private rootForm : FormGroupDirective
