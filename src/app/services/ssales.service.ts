import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SsalesService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, public api: ApiService) {}

  POST(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post(path, JSON.stringify(body), this.httpOptions)
      .pipe(catchError(this.formatErrors));
  }
  private formatErrors(error: any) {
    return throwError(error.error);
  }

  //#region getmax invoice number
  getMaxInvoiceNo(vchtype: any, branch: any, fycode: any, fy: any) {
    return this.http
      .get<any>(
        this.api.URL +
          'api/vSSales/getMaxInvno?vchtype=' +
          vchtype +
          '&branch=' +
          branch +
          '&fycode=' +
          fycode +
          '&fy=' +
          fy
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  //#endregion
  getCustomers() {
    return this.http
      .get<any>(this.api.URL + 'api/vSSales/getCustomerAccounts')
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
    return this.http
      .get<any>(this.api.URL + 'api/vSSales/getSalesAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getDefaultAccounts() {
    return this.http
      .get<any>(this.api.URL + 'api/vSSales/getDefaultAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  Insert_Sales(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vSSales', postdata);
  }

  Insert_Bulk_Sales_Details(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vSSalesDetails/insertBulk', postdata);
  }

  Insert_Ledger(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/accountentries', postdata);
  }

  Insert_Overdue(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/overdue', postdata);
  }

  getPendingSOListDetails(cuscode: any) {
    return this.http
      .get<any>(
        this.api.URL +
          'api/vSSales/getPendingSOListDetails?customercode=' +
          cuscode
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPendingSOListAll() {
    return this.http
      .get<any>(this.api.URL + 'api/vSSales/getPendingSOListAll')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPendingSOListSO() {
    return this.http
      .get<any>(this.api.URL + 'api/vSSales/getPendingSOListSO')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPendingSOListSOService() {
    return this.http
      .get<any>(this.api.URL + 'api/vSSales/getPendingSOListSOService')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  Delete_SavedDefSalesFields(
    invno: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vSSales/deleteSalesCusFields?invno=' +
        invno +
        '&vtype=' +
        vtype +
        '&branch=' +
        branch +
        '&fy=' +
        fy
    );
  }
  Delete_Sales(invno: any, vtype: any, branch: any, fy: any): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vSSales/deleteSales?invno=' +
        invno +
        '&vtype=' +
        vtype +
        '&branch=' +
        branch +
        '&fy=' +
        fy
    );
  }
  Delete_SalesDetails(
    invno: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vSSales/deleteSALESDetails?invno=' +
        invno +
        '&vtype=' +
        vtype +
        '&branch=' +
        branch +
        '&fy=' +
        fy
    );
  }
  Delete_Accounts(
    invno: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vSSales/deleteSSalesAccounts?invno=' +
        invno +
        '&vtype=' +
        vtype +
        '&branch=' +
        branch +
        '&fy=' +
        fy
    );
  }
  Delete_overdue(
    invno: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vSSales/deleteSSalesOverdue?invno=' +
        invno +
        '&vtype=' +
        vtype +
        '&branch=' +
        branch +
        '&fy=' +
        fy
    );
  }
  deteleAllLedger(
    invno: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/accountentries/deteleAllLedger?vchno=' +
        invno +
        '&vtype=' +
        vtype +
        '&branch=' +
        branch +
        '&fy=' +
        fy
    );
  }

  getSalesListAll() {
    return this.http
      .get<any>(this.api.URL + 'api/vSSales/GetSalesListAll')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  get_Sales(invno: any): Observable<any> {
    return this.http
      .get(this.api.URL + 'api/vSSales/getSalesData?invno=' + invno)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  get_SalesDetails(invno: any): Observable<any> {
    return this.http
      .get(this.api.URL + 'api/vSSales/getSalesDetailsData?invno=' + invno)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getSavedAccounts(): Observable<any> {
    return this.http.get(this.api.URL + 'api/saleDefAccs').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  insertCusFields(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vSSalesCusFields', postdata);
  }

  getSavedDefSalesFields(invno: any) {
    return this.http
      .get<any>(
        this.api.URL + 'api/vSSales/getSavedDefSalesFields?invno=' + invno
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getAllServiceSalesList({
    statusId,
    ledgerId,
    salesRef,
    globalFilterId,
    search,
    fromDate,
    toDate,
  }: {
    statusId?: number;
    ledgerId?: number;
    salesRef?: string;
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
    if (salesRef) {
      params = params.append('salesRef', salesRef);
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
      .get<any>(this.api.URL + 'api/vServiceSales/getServiceSalesLists', {
        params: params,
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getServiceSalesDetail({ id }: { id: string }) {
    let params = new HttpParams();
    if (id) {
      params = params.append('id', id);
    }

    return this.http
      .get<any>(this.api.URL + 'api/vServiceSales/getServiceSales', {
        params: params,
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
