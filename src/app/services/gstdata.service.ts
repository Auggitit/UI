import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GstdataService {
  
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  constructor(private http : HttpClient,public api:ApiService) { }
 
  POST(path: string, body: Object = {}): Observable<any> { 
    // console.log(JSON.stringify(body));
    return this.http
      .post(path, JSON.stringify(body), this.httpOptions)
      .pipe(catchError(this.formatErrors));
  }  
  private formatErrors(error: any) {
    return throwError(error.error);    
  }

  Insert_GstData(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/GstDatas', postdata);
  }
  
  Delete_GstData(invno: any, vtype: any,branch:any,fy:any): Observable<any> {
    return this.http.get(
      this.api.URL +
        'api/GstDatas/deleteGSTData?invno=' +
        invno +
        '&vtype=' +
        vtype + '&branch=' + branch + '&fy=' + fy 
    );
  }
  
}
