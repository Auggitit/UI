import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { GrnService } from 'src/app/services/grn.service';
import { PendingpoComponent } from 'src/app/vouchers/models/pendingpo/pendingpo.component';
import { Vendor } from '../Interface/all-interface';

@Component({
  selector: 'app-vendor-component',
  templateUrl: './vendor-component.component.html',
  styleUrls: ['./vendor-component.component.scss'],
})
export class VendorComponentComponent implements OnInit {
  @Output() vendorpodataChanged = new EventEmitter<any>();
  @Output() vendorCode = new EventEmitter<any>();

  constructor(
    public grnapi: GrnService,
    public fb: FormBuilder,
    public dialog: MatDialog
  ) {}
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
  //#endregion
  ngOnInit(): void {
    this.setValidator();
    this.loadVendors();
  }
  setValidator() {
    this.formGRN = this.fb.group({
      cvendorname: ['', [Validators.required]],
    });
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
      this.emitVendorCode();
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
    this.emitVendorCode();
  }

  showPendingPODetails() {
    let dialogRef = this.dialog.open(PendingpoComponent, {
      // maxWidth: '80vw',
      // maxHeight: '80vh',
      // height: '100%',
      // width: '100%',
      // panelClass: 'full-screen-modal',
    });
    dialogRef.componentInstance.polist = this.vendorpodata;
    dialogRef.afterClosed().subscribe((result) => {
      this.result = result;
      this.emitVendorpodata();
    });
  }

  emitVendorpodata() {
    console.log(this.result.polistDetails)
    this.vendorpodataChanged.emit(this.result);
  }

  emitVendorCode() {
    var arr = {
      vcode: this.vendorcode,
      vname: this.vendorname,
      vstatecode: this.vendorstatecode,
    };
    this.vendorCode.emit(arr);
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
}
