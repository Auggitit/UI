import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class GrnserviceService {
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

  //#region sgrndetails
  Insert_Bulk_GRN_Details(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vSGrnDetails/insertBulk', postdata);
  }
  Delete_GRNDetails(
    invno: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vSGrnDetails/deleteSGRNDetails?invno=' +
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

  //#region vSGrnCusFields
  insertCusFields(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vSGrnCusFields', postdata);
  }
  Delete_CusdefFields(
    invno: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vSGrnCusFields/deleteCusDefField?invno=' +
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

  //#region  Sgrn
  Insert_GRN(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vSGrns', postdata);
  }
  Delete_GRN(invno: any, vtype: any, branch: any, fy: any): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vSGrns/deleteGRN?invno=' +
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

  //#region accountentries
  Insert_Ledger(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/accountentries', postdata);
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
  //#endregion
  //#region overdue
  Insert_Overdue(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/overdue', postdata);
  }
  Delete_overdue(
    invno: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/overdue/deleteGRNOverdue?invno=' +
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

  getAllLedgers() {
    return this.http
      .get<any>(this.api.URL + 'api/accountentries/getAllAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getVendors() {
    return this.http
      .get<any>(this.api.URL + 'api/vSGrns/getVendorAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getCusList(invno: any) {
    return this.http
      .get<any>(this.api.URL + 'api/vSGrnCusFields/getcusFields?invno=' + invno)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  get_Ledger(pono: any) {
    return this.http
      .get<any>(this.api.URL + 'api/accountentries/getLedger?vchno=' + pono)
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

  getMaxInvoiceNo(vchtype: any, branch: any, fycode: any, fy: any) {
    return this.http
      .get<any>(
        this.api.URL +
          'api/vSGrns/getMaxInvno?vchtype=' +
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

  getPendingPoServiceListAll() {
    return this.http
      .get<any>(this.api.URL + 'api/vSGrns/GetPendingPOServiceListAll')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPendingPoListAll() {
    return this.http
      .get<any>(this.api.URL + 'api/vSGrns/GetPendingPOListAll')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPendingPoList(vendorcode: any) {
    return this.http
      .get<any>(
        this.api.URL + 'api/vSGrns/GetPendingPOList?vendorcode=' + vendorcode
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPendingPoListDetails(vendorcode: any) {
    return this.http
      .get<any>(
        this.api.URL +
          'api/vSGrns/getPendingPOListDetails?vendorcode=' +
          vendorcode
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPurchaseAccounts() {
    return this.http
      .get<any>(this.api.URL + 'api/vSGrns/getPurchaseAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getDefaultAccounts() {
    return this.http
      .get<any>(this.api.URL + 'api/vSGrns/getDefaultAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getGRNListAll() {
    return this.http.get<any>(this.api.URL + 'api/vSGrns/GetGRNListAll').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  get_GRN(invno: any): Observable<any> {
    return this.http.get(this.api.URL + 'api/vSGrns/getGRNData?invno=' + invno);
  }
  get_GRNDetails(invno: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/vSGrns/getGRNDetailsData?invno=' + invno
    );
  }
  getSavedAccounts(): Observable<any> {
    return this.http.get(this.api.URL + 'api/purchaseDefAccs');
  }
  getSavedDefFields(invno: any) {
    return this.http
      .get<any>(this.api.URL + 'api/vSGrns/getSGRNSavedDefData?invno=' + invno)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  // Delete_GRN(invno: any,vtype:any): Observable<any> {
  //   return this.http.get(this.api.URL + "api/vSGrns/deleteSGRN?invno="+ invno + "&vtype=" + vtype);
  // }

  // Delete_Accounts(invno: any,vtype:any): Observable<any> {
  //   return this.http.get(this.api.URL + "api/vSGrns/deleteSGRNAccounts?invno="+ invno + "&vtype=" + vtype);
  // }
  // Delete_overdue(invno: any,vtype:any): Observable<any> {
  //   return this.http.get(this.api.URL + "api/vSGrns/deleteSGRNOverdue?invno="+ invno + "&vtype=" + vtype);
  // }

  //UI
  getAllServiceGrnList({
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
      .get<any>(this.api.URL + 'api/vServiceGrn/getSGrnLists', {
        params: params,
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getServiceGrnDetail({ id }: { id: string }) {
    let params = new HttpParams();
    if (id) {
      params = params.append('id', id);
    }

    return this.http
      .get<any>(this.api.URL + 'api/vServiceGrn/getSGrn', { params: params })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
