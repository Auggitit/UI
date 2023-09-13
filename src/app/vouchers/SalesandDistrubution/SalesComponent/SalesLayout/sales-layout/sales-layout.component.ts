import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { SsalesService } from 'src/app/services/ssales.service';
import { Acc, SalesInitial } from '../../SalesTs/SalesInitial';
import { map, startWith } from 'rxjs';


@Component({
  selector: 'app-sales-layout',
  templateUrl: './sales-layout.component.html',
  styleUrls: ['./sales-layout.component.scss']
})
export class SalesLayoutComponent implements OnInit {

  form!:FormGroup
  constructor(public salesapi: SsalesService,public fb:FormBuilder) { 
    this.form = new FormGroup({
      cinvno: new FormControl(),
      cinvdate: new FormControl(),
      cpono: new FormControl(),
      cpodate: new FormControl(),
      cvchtype: new FormControl(),
      cacntname: new FormControl(),
    });
    this.form = this.fb.group({
     
      cinvno:  [''],
      cinvdate:  [''],
      cpono:  [''],
      cpodate:  [''],
      cvchtype:  [''],
      cacntname:  [''],
    });

  }
 

  ngOnInit(): void {
    // this.form = this.rootForm.control.get("basicInfo") as FormGroup;

    
    this. getMaxInvoiceNo();
    this.loadSalesAccounts()
    
  }
  
  variables :any = new SalesInitial();
  
 
  getMaxInvoiceNo()
  {
    return new Promise((resolve) => { 
      this.salesapi.getMaxInvoiceNo(this.variables.vchtype,this.variables.branch,this.variables.fy,this.variables.fyname).subscribe(res=>{
          this.variables.invno = res.invNo;
          resolve({ action: 'success' });
      })
    });
  }
  loadSalesAccounts()
  {
    this.salesapi.getSalesAccounts().subscribe(res=>{
      this.variables.accArray = JSON.parse(res);   
      if (this.variables.accSearch) {
        this.variables.filteredAccounts = this.variables.accSearch.valueChanges.pipe(
          startWith(''),
          map((acc) =>
            acc ? this._filterAccounts(acc) : this.variables.accArray.slice()
          )
        );
      }
    });
  }
  private _filterAccounts(value: any): Acc[] {
    const filterValue = value.toLowerCase();
    return this.variables.accArray.filter((acc:any) =>
      acc.ledgername.toLowerCase().includes(filterValue)
    );
  }
  accountChanged(event: any, data: any)
  {
    if (event.isUserInput == true) { 
      this.variables.vchaccountcode = data.ledgercode;
      this.variables.vchaccount= data.ledgername;
    }
  }

}





// private rootForm : FormGroupDirective
