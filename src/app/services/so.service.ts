import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SoService {
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

  getDefSOFields() {
    return this.http.get<any>(this.URL + 'api/sdefs').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getSavedDefSOFields(sono: any) {
    return this.http
      .get<any>(this.URL + 'api/vSOes/getSavedDefSOFields?sono=' + sono)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getVendors() {
    return this.http.get<any>(this.URL + 'api/vSOes/getCustomerAccounts').pipe(
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

  getMaxInvoiceNo(type: any, branch: any, fycode: any, fy: any) {
    return this.http
      .get<any>(
        this.URL +
          'api/vSOes/getMaxInvno?sotype=' +
          type +
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

  insertCusFields(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/soCusFields', postdata);
  }

  Insert_SO(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/vSOes', postdata);
  }

  Insert_Bulk_SO_Details(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/vSODetails/insertBulk', postdata);
  }

  Delete_SOCusFields(sono: any): Observable<any> {
    return this.http.get(this.URL + 'api/vSOes/deleteDefSOFields?sono=' + sono);
  }
  Delete_SO(sono: any): Observable<any> {
    return this.http.get(this.URL + 'api/vSOes/deleteSO?sono=' + sono);
  }
  Delete_SODetails(sono: any): Observable<any> {
    return this.http.get(this.URL + 'api/vSOes/deleteSODetails?sono=' + sono);
  }

  get_SO(sono: any): Observable<any> {
    return this.http.get(this.URL + 'api/vSOes/getSOData?sono=' + sono);
  }
  get_SODetails(sono: any): Observable<any> {
    return this.http.get(this.URL + 'api/vSOes/getSODetailsData?sono=' + sono);
  }

  getAllSoList({
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
      .get<any>(this.URL + 'api/vSalesOrder/getSOLists', { params: params })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getSoDetail({ id }: { id: string }) {
    let params = new HttpParams();
    if (id) {
      params = params.append('id', id);
    }

    return this.http
      .get<any>(this.URL + 'api/vSalesOrder/getSO', { params: params })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  get_SaleRef() {
    return this.http.get<any>(this.URL + 'api/salesRefs').pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
