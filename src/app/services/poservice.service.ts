import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class PoserviceService {
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

  //#region cusfields
  insertCusFields(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/spoCusFields', postdata);
  }
  deleteCusFields(
    pono: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/spoCusFields/deleteCusDefField?invno=' +
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
  //#region spodetails
  Insert_Bulk_PO_Details(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vSPODetails/insertBulk', postdata);
  }
  Delete_PODetails(
    pono: any,
    vtype: any,
    branch: any,
    fy: any
  ): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vSPODetails/deletePODetails?pono=' +
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

  //#region Spo
  Insert_PO(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/vSPOes', postdata);
  }
  Delete_PO(pono: any, vtype: any, branch: any, fy: any): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vSPOes/deletePO?pono=' +
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

  getVendors() {
    return this.http
      .get<any>(this.api.URL + 'api/vGrns/getVendorAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getMaxInvoiceNo(potype: any, branch: any, fycode: any, fy: any) {
    return this.http
      .get<any>(
        this.api.URL +
          'api/vSPOes/getMaxInvno?potype=' +
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
      .get<any>(this.api.URL + 'api/vSPOes/getSavedDefPOFields?pono=' + pono)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getSavedDefSOFields(pono: any) {
    return this.http
      .get<any>(this.api.URL + 'api/vSPOes/getSavedDefPOFields?pono=' + pono)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  get_PO(pono: any): Observable<any> {
    return this.http.get(this.api.URL + 'api/vSPOes/getPOData?pono=' + pono);
  }
  get_PODetails(pono: any): Observable<any> {
    return this.http.get(
      this.api.URL + 'api/vSPOes/getPODetailsData?pono=' + pono
    );
  }

  //  Delete_PO(pono: any,vtype:any): Observable<any> {
  //    return this.http.get(this.api.URL + "api/vSPOes/deleteSPO?pono="+pono + "&vtype=" + vtype);
  //  }
  //  Delete_PODetails(pono: any,vtype:any): Observable<any> {
  //    return this.http.get(this.api.URL + "api/vSPOes/deleteSPODetails?pono="+pono + "&vtype=" + vtype);
  //  }
  deleteDefFields(pono: any, vtype: any): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/vSPOes/deleteSPODefFields?pono=' +
        pono +
        '&vtype=' +
        vtype
    );
  }

  //UI
  getAllServicePoList({
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
      params = params.append('vendorId', ledgerId);
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
      .get<any>(this.api.URL + 'api/vServicePurchaseOrder/getSPOLists', {
        params: params,
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getServicePoDetail(id: string) {
    let params = new HttpParams();
    if (id) {
      params = params.append('id', id);
    }

    return this.http
      .get<any>(this.api.URL + 'api/vServicePurchaseOrder/getSPO', {
        params: params,
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
