import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class GrnService {
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
    return this.http
      .get<any>(this.api.URL + 'api/vGrns/getVendorAccounts')
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
          'api/vGrns/getMaxInvno?vchtype=' +
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

  //#region grndetails
  Insert_Bulk_GRN_Details(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vGrnDetails/insertBulk', postdata);
  }
  Delete_GRNDetails(
    invno: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vGrnDetails/deleteGRNDetails?invno=' +
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
  //#region grn
  Insert_GRN(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vGrns', postdata);
  }
  Delete_GRN(invno: any, vtype: any, branch: any, fy: any): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vGrns/deleteGRN?invno=' +
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
  //#region customfields
  insertCusFields(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vGrnCusFields', postdata);
  }
  Delete_CusdefFields(
    invno: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vGrnCusFields/deleteCusDefField?invno=' +
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
  //#region accountentry
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
  //#region purchase gstdata

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

  get_Ledger(pono: any) {
    return this.http
      .get<any>(this.api.URL + 'api/accountentries/getLedger?vchno=' + pono)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getCusList(invno: any) {
    return this.http
      .get<any>(this.api.URL + 'api/vGrnCusFields/getcusFields?invno=' + invno)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPendingPoServiceListAll() {
    return this.http
      .get<any>(this.api.URL + 'api/vGrns/GetPendingPOServiceListAll')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPendingPoListAll() {
    return this.http
      .get<any>(this.api.URL + 'api/vGrns/GetPendingPOListAll')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPendingPoList(vendorcode: any) {
    return this.http
      .get<any>(
        this.api.URL + 'api/vGrns/GetPendingPOList?vendorcode=' + vendorcode
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPendingPoListDetails(vendorcode: any, branch: any, fy: any) {
    return this.http
      .get<any>(
        this.api.URL +
          'api/vGrns/getPendingPOListDetails?vendorcode=' +
          vendorcode +
          '&branch=' +
          branch +
          '&fy=' +
          fy
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  getPendingPoOutstanding(vendorcode: any, branch: any, fy: any) {
    return this.http
      .get<any>(
        this.api.URL +
          'api/vGrns/getOutStanding?acccode=' +
          vendorcode +
          '&branch=' +
          branch +
          '&fy=' +
          fy
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPurchaseAccounts() {
    return this.http
      .get<any>(this.api.URL + 'api/vGrns/getPurchaseAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getGSTAccounts() {
    return this.http
      .get<any>(this.api.URL + 'api/vGrns/getDefaultAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getDefaultAccounts() {
    return this.http
      .get<any>(this.api.URL + 'api/vGrns/getDefaultAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  getGstAccounts() {
    return this.http.get<any>(this.api.URL + 'api/vGrns/getGstAccounts').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getGRNListAll() {
    return this.http.get<any>(this.api.URL + 'api/vGrns/GetGRNListAll').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getSavedAccounts(): Observable<any> {
    return this.http.get(this.api.URL + 'api/purchaseDefAccs');
  }
  get_GRN(invno: any): Observable<any> {
    return this.http.get(this.api.URL + 'api/vGrns/getGRNData?invno=' + invno);
  }
  get_GRNDetails(invno: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/vGrns/getGRNDetailsData?invno=' + invno
    );
  }

  getSavedDefFields(invno: any) {
    return this.http
      .get<any>(this.api.URL + 'api/vGrns/getSavedDefData?invno=' + invno)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  //UI
  getAllGrnList({
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
      .get<any>(this.api.URL + 'api/vGrn/getGrnLists', { params: params })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getGrnDetail({ id }: { id: string }) {
    let params = new HttpParams();
    if (id) {
      params = params.append('id', id);
    }

    return this.http
      .get<any>(this.api.URL + 'api/vGrn/getGrn', { params: params })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
