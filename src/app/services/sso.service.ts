import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SsoService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, public api: ApiService) {}

  POST(path: string, body: Object = {}): Observable<any> {
    //  console.log(JSON.stringify(body));
    return this.http
      .post(path, JSON.stringify(body), this.httpOptions)
      .pipe(catchError(this.formatErrors));
  }

  private formatErrors(error: any) {
    return throwError(error.error);
  }
  get_Ledger(pono: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/OtherAccEntries/getLedger?vchno=' + pono
    );
  }

  getDefSOFields() {
    return this.http.get<any>(this.api.URL + 'api/sdefs').pipe(
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
  getSavedDefSOFields(sono: any) {
    return this.http
      .get<any>(this.api.URL + 'api/vSSOes/getSavedDefSOFields?sono=' + sono)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getVendors() {
    return this.http
      .get<any>(this.api.URL + 'api/vSSOes/getCustomerAccounts')
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

  getMaxInvoiceNo(type: any, branch: any, fycode: any, fy: any, prefix: any) {
    console.log('so load');
    return this.http
      .get<any>(
        this.api.URL +
          'api/vSSOes/getMaxInvno?sotype=' +
          type +
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
  Inser_DelivertAddress(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/mDeliveryAddresses', postdata);
  }
  showDeliveryAddress(lcode: any) {
    return this.http
      .get<any>(
        this.api.URL +
          'api/mDeliveryAddresses/getDeliveryAddress?lcode=' +
          lcode
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  insertCusFields(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/ssoCusFields', postdata);
  }

  Insert_SO(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vSSOes', postdata);
  }

  Insert_Bulk_SO_Details(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vSSODetails/insertBulk', postdata);
  }
  Delete_SOCusFields(
    sono: any,
    vchtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vSSOes/deleteDefSOFields?sono=' +
        sono +
        '&vchtype=' +
        vchtype +
        '&branch=' +
        branch +
        '&fy=' +
        fy
    );
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
  Delete_SO(sono: any, vchtype: any, branch: any, fy: any): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vSSOes/deleteSO?sono=' +
        sono +
        '&vchtype=' +
        vchtype +
        '&branch=' +
        branch +
        '&fy=' +
        fy
    );
  }

  Delete_SODetails(
    sono: any,
    vchtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vSSOes/deleteSODetails?sono=' +
        sono +
        '&vchtype=' +
        vchtype +
        '&branch=' +
        branch +
        '&fy=' +
        fy
    );
  }

  get_SO(sono: any): Observable<any> {
    return this.http.get(this.api.URL + 'api/vSOes/getSOData?sono=' + sono);
  }
  get_SSO(sono: any): Observable<any> {
    return this.http.get(this.api.URL + 'api/vSSOes/getSOData?sono=' + sono);
  }
  get_SODetails(sono: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/vSOes/getSODetailsData?sono=' + sono
    );
  }
  get_SSODetails(sono: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/vSSOes/getSODetailsData?sono=' + sono
    );
  }

  get_SaleRef() {
    return this.http.get<any>(this.api.URL + 'api/salesRefs').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  //UI
  getAllServiceSoList({
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
      .get<any>(this.api.URL + 'api/vServiceSalesOrder/getSSOLists', {
        params: params,
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getServiceSoDetail({ id }: { id: string }) {
    let params = new HttpParams();
    if (id) {
      params = params.append('id', id);
    }

    return this.http
      .get<any>(this.api.URL + 'api/vServiceSalesOrder/getSSO', {
        params: params,
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
