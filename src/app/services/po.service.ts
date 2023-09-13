import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class PoService {
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

  //#region  cusFields
  insertCusFields(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/poCusFields', postdata);
  }
  deleteCusFields(
    pono: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/poCusFields/deleteCusDefField?invno=' +
        pono +
        '&vtype=' +
        vtype +
        '&branch=' +
        branch +
        '&fy=' +
        fy
    );
  }
  //#endregion
  //#region podetails
  Insert_Bulk_PO_Details(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vPODetails/insertBulk', postdata);
  }
  Delete_PODetails(
    pono: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vPODetails/deletePODetails?pono=' +
        pono +
        '&vtype=' +
        vtype +
        '&branch=' +
        branch +
        '&fy=' +
        fy
    );
  }
  //#endregion
  //#region Po
  Insert_PO(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vPOes', postdata);
  }
  Delete_PO(pono: any, vtype: any, branch: any, fy: any): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vPOes/deletePO?pono=' +
        pono +
        '&vtype=' +
        vtype +
        '&branch=' +
        branch +
        '&fy=' +
        fy
    );
  }
  //#endregion
  //#region  OtherAcc
  Insert_PoLedger(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/OtherAccEntries', postdata);
  }
  deteleAllOtherLedger(
    invno: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/OtherAccEntries/deteleAllOtherLedger?vchno=' +
        invno +
        '&vtype=' +
        vtype +
        '&branch=' +
        branch +
        '&fy=' +
        fy
    );
  }
  //#endregion

  getVendors() {
    return this.http
      .get<any>(this.api.URL + 'api/vGrns/getVendorAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getProducts() {
    return this.http.get<any>(this.api.URL + 'api/mItems/getItems').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getMaxInvoiceNo(potype: any, branch: any, fycode: any, fy: any) {
    return this.http
      .get<any>(
        this.api.URL +
          'api/vPOes/getMaxInvno?potype=' +
          potype +
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

  getDefPOFields() {
    return this.http.get<any>(this.api.URL + 'api/pdefs').pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getSavedDefFields(pono: any) {
    return this.http
      .get<any>(this.api.URL + 'api/vPOes/getSavedDefPOFields?pono=' + pono)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  get_PO(pono: any): Observable<any> {
    return this.http.get(this.api.URL + 'api/vPOes/getPOData?pono=' + pono);
  }

  get_PODetails(pono: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/vPOes/getPODetailsData?pono=' + pono
    );
  }

  deleteDefFields(pono: any, vtype: any): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vPOes/deletePODefFields?pono=' +
        pono +
        '&vtype=' +
        vtype
    );
  }

  get_Ledger(pono: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/OtherAccEntries/getLedger?vchno=' + pono
    );
  }
  getAllPo() {
    return this.http.get<any>(this.api.URL + 'api/vPOes').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  //UI
  getAllPoList({
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
      .get<any>(this.api.URL + 'api/vPurchaseOrder/getPOLists', {
        params: params,
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPoDetail({ id }: { id: string }) {
    let params = new HttpParams();
    if (id) {
      params = params.append('id', id);
    }

    return this.http
      .get<any>(this.api.URL + 'api/vPurchaseOrder/getPO', { params: params })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
