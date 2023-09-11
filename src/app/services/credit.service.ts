import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CrnoteService {
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
          'api/vCRs/getMaxInvno?vchtype=' +
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

  getCustomers() {
    return this.http
      .get<any>(this.api.URL + 'api/vCRs/getCustomerAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getProducts() {
    return this.http.get<any>(this.api.URL + 'api/mItems').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getSalesAccounts() {
    return this.http.get<any>(this.api.URL + 'api/vCRs/getSalesAccounts').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getDefaultAccounts() {
    return this.http
      .get<any>(this.api.URL + 'api/vCRs/getDefaultAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  Insert_Sales(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vCRs', postdata);
  }

  Insert_Bulk_Sales_Details(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vCRDetails/insertBulk', postdata);
  }

  Insert_Ledger(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/accountentries', postdata);
  }

  getSavedAccounts(): Observable<any> {
    return this.http.get(this.api.URL + 'api/saleDefAccs');
  }

  Delete_Sales(invno: any): Observable<any> {
    return this.http.get(this.api.URL + 'api/vCRs/deleteSales?invno=' + invno);
  }
  Delete_Accounts(invno: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/vCRs/deleteCRAccounts?invno=' + invno
    );
  }
  Delete_SalesDetails(invno: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/vCRs/deleteSALESDetails?invno=' + invno
    );
  }

  getCRNListAll() {
    return this.http.get<any>(this.api.URL + 'api/vCRs/GetCRNListAll').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  get_CRN(invno: any): Observable<any> {
    return this.http.get(this.api.URL + 'api/vCRs/getSalesData?invno=' + invno);
  }
  get_CRNDetails(invno: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/vCRs/getSalesDetailsData?invno=' + invno
    );
  }

  get_CR(invno: any): Observable<any> {
    return this.http.get(this.api.URL + 'api/vCRs/getSalesData?invno=' + invno);
  }
  get_CRDetails(invno: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/vCRs/getSalesDetailsData?invno=' + invno
    );
  }
  getSavedDefSOFields(sono: any) {
    return this.http
      .get<any>(this.api.URL + 'api/vSOes/getSavedDefSOFields?sono=' + sono)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  getDefSOFields() {
    return this.http.get<any>(this.api.URL + 'api/sdefs').pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  // getPendingSOListDetails(cuscode:any)
  // {
  //   return this.http.get<any>( this.api.api.URL + "api/vSales/getPendingSOListDetails?customercode="+cuscode).pipe(map((res:any)=>{
  //     return res;
  //   }));
  // }
  getAllCreditList({
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
    if (fromDate && toDate) {
      params = params.append('fromDate', fromDate);
      params = params.append('toDate', toDate);
    }
    return this.http
      .get<any>(this.api.URL + 'api/vCreditNote/getCNLists', { params: params })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getCreditDetail({ id }: { id: string }) {
    let params = new HttpParams();
    if (id) {
      params = params.append('id', id);
    }

    return this.http
      .get<any>(this.api.URL + 'api/vCreditNote/getCN', { params: params })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
