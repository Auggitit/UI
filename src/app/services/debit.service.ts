import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class DrnoteService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, public api: ApiService) {}

  POST(path: string, body: Object = {}): Observable<any> {
    // console.log(JSON.stringify(body));
    return this.http
      .post(path, JSON.stringify(body), this.httpOptions)
      .pipe(catchError(this.formatErrors));
  }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  getVendors() {
    return this.http.get<any>(this.api.URL + 'api/vDRs/getVendorAccounts').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getSavedAccounts(): Observable<any> {
    return this.http.get(this.api.URL + 'api/purchaseDefAccs');
  }

  getProducts() {
    return this.http.get<any>(this.api.URL + 'api/mItems').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getMaxInvoiceNo(
    vchtype: any,
    branch: any,
    fycode: any,
    fy: any,
    prefix: any
  ) {
    return this.http
      .get<any>(
        this.api.URL +
          'api/vDRs/getMaxInvno?vchtype=' +
          vchtype +
          '&branch=' +
          branch +
          '&fycode=' +
          fycode +
          '&fy=' +
          fy +
          '&prefix=' +
          prefix
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  Insert_DN(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vDRs', postdata);
  }

  Insert_Bulk_DN_Details(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vDRDetails/insertBulk', postdata);
  }

  Insert_Ledger(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/accountentries', postdata);
  }

  getPurchaseAccounts() {
    return this.http
      .get<any>(this.api.URL + 'api/vDRs/getPurchaseAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getDefaultAccounts() {
    return this.http
      .get<any>(this.api.URL + 'api/vDRs/getDefaultAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getGRNListAll() {
    return this.http.get<any>(this.api.URL + 'api/vDRs/GetDRNListAll').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  Delete_DRN(invno: any): Observable<any> {
    return this.http.get(this.api.URL + 'api/vDRs/deleteDRN?invno=' + invno);
  }
  Delete_DRNDetails(invno: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/vDRs/deleteGRNDetails?invno=' + invno
    );
  }
  Delete_Accounts(invno: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/vDRs/deleteDRAccounts?invno=' + invno
    );
  }

  get_DRN(invno: any): Observable<any> {
    return this.http.get(this.api.URL + 'api/vDRs/getGRNData?invno=' + invno);
  }
  get_DRNDetails(invno: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/vDRs/getGRNDetailsData?invno=' + invno
    );
  }

  get_DR(invno: any): Observable<any> {
    return this.http.get(this.api.URL + 'api/vDRs/getGRNData?invno=' + invno);
  }
  get_DRDetails(invno: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/vDRs/getGRNDetailsData?invno=' + invno
    );
  }
  getAllDebitList({
    statusId,
    ledgerId,
    globalFilterId,
    search,
    fromDate,
    toDate,
  }: {
    statusId?: number;
    ledgerId?: number;
    globalFilterId?: number;
    search?: string;
    fromDate?: string;
    toDate?: string;
  }) {
    let params = new HttpParams();
    if (statusId) {
      params = params.append('statusId', statusId);
    }
    if (ledgerId) {
      params = params.append('ledgerId', ledgerId);
    }
    if (globalFilterId) {
      params = params.append('globalFilterId', globalFilterId);
    }
    if (search) {
      params = params.append('search', search);
    }
    if (fromDate) {
      params = params.append('fromDate', fromDate);
    }
    if (toDate) {
      params = params.append('toDate', toDate);
    }
    return this.http
      .get<any>(this.api.URL + 'api/vSalesOrder/getSOLists', { params: params })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getDebitDetail({ id }: { id: string }) {
    let params = new HttpParams();
    if (id) {
      params = params.append('id', id);
    }

    return this.http
      .get<any>(this.api.URL + 'api/vSalesOrder/getSO', { params: params })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
