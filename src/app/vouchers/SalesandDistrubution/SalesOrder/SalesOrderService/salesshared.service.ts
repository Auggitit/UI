import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalessharedService {
  private selectedvendorSource = new BehaviorSubject<any>(null);
  vendorstatecode = this.selectedvendorSource.asObservable();


  private formValuesSource = new BehaviorSubject<any>({});
  formValues = this.formValuesSource.asObservable();
  constructor() {}

  setSelectedVendor(vendor: any) {
    this.selectedvendorSource.next(vendor);
  }
  setFormValues(values: any) {
    this.formValuesSource.next(values);
  }
}
