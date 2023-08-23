import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PoserviceService {
  URL = 'https://localhost:7037/';
  // URL = 'https://auggitapi.brositecom.com/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  POST(path: string, body: Object = {}): Observable<any> {
    console.log(JSON.stringify(body));
    return this.http
      .post(path, JSON.stringify(body), this.httpOptions)
      .pipe(catchError(this.formatErrors));
  }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  getVendors() {
    return this.http.get<any>(this.URL + 'api/vGrns/getVendorAccounts').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getProducts() {
    return this.http.get<any>(this.URL + 'api/mItems').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getMaxInvoiceNo(potype: any, branch: any, fycode: any, fy: any) {
    return this.http
      .get<any>(
        this.URL +
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
    return this.http.get<any>(this.URL + 'api/pdefs').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getSavedDefFields(pono: any) {
    return this.http
      .get<any>(this.URL + 'api/vSPOes/getSavedDefPOFields?pono=' + pono)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getSavedDefSOFields(pono: any) {
    return this.http
      .get<any>(this.URL + 'api/vSPOes/getSavedDefPOFields?pono=' + pono)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  get_PO(pono: any): Observable<any> {
    return this.http.get(this.URL + 'api/vSPOes/getPOData?pono=' + pono);
  }
  get_PODetails(pono: any): Observable<any> {
    return this.http.get(this.URL + 'api/vSPOes/getPODetailsData?pono=' + pono);
  }

  insertCusFields(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/spoCusFields', postdata);
  }

  Insert_PO(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/vSPOes', postdata);
  }

  Insert_Bulk_PO_Details(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/vSPODetails/insertBulk', postdata);
  }

  Delete_PO(pono: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL + 'api/vSPOes/deleteSPO?pono=' + pono + '&vtype=' + vtype
    );
  }
  Delete_PODetails(pono: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL + 'api/vSPOes/deleteSPODetails?pono=' + pono + '&vtype=' + vtype
    );
  }
  deleteDefFields(pono: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL +
        'api/vSPOes/deleteSPODefFields?pono=' +
        pono +
        '&vtype=' +
        vtype
    );
  }
  getAllServicePoList({
    statusId,
    vendorId,
    globalFilterId,
    search,
    fromDate,
    toDate,
  }: {
    statusId?: number;
    vendorId?: number;
    globalFilterId?: number;
    search?: string;
    fromDate?: string;
    toDate?: string;
  }) {
    let params = new HttpParams();
    if (statusId) {
      params = params.append('statusId', statusId);
    }
    if (vendorId) {
      params = params.append('vendorId', vendorId);
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
      .get<any>(this.URL + 'api/vServicePurchaseOrder/getSPOLists', {
        params: params,
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getServicePoDetail({ id }: { id: string }) {
    let params = new HttpParams();
    if (id) {
      params = params.append('id', id);
    }

    return this.http
      .get<any>(this.URL + 'api/vServicePurchaseOrder/getSPO', {
        params: params,
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
