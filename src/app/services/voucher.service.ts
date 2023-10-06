import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

   httpOptions = {
     headers: new HttpHeaders({
       "Content-Type": "application/json"
     })
   };
 
   constructor(private http : HttpClient,public api:ApiService) { }
 
   POST(path: string, body: Object = {}): Observable<any> { 
    //  console.log(JSON.stringify(body));
     return this.http
       .post(path, JSON.stringify(body), this.httpOptions)
       .pipe(catchError(this.formatErrors));
   } 
 
   private formatErrors(error: any) {
     return throwError(error.error);    
   }
 
   getMaxInvoiceNo(type:any)
   {
     return this.http.get<any>( this.api.URL + "api/voucher/getMaxInvno?vtype=" + type).pipe(map((res:any)=>{
       return res;
     }));
   }

   getVoucherListForEdit(vchno:any,vchtype:any)
   {
     return this.http.get<any>( this.api.URL + "api/overdue/getOverDueListForEdit?vchno=" + vchno + "&vchtype=" + vchtype).pipe(map((res:any)=>{
       return res;
     }));
   }
 
   getPendingVendorInvoicesForEdit(lcode:any,vchno:any,vchtype:any)
   {
     return this.http.get<any>( this.api.URL + "api/overdue/getVendorOverDuesForEdit?lcode=" + lcode + "&entryno=" + vchno + "&vchtype=" + vchtype).pipe(map((res:any)=>{
       return res;
     }));
   }

   getPendingCustomerInvoicesForEdit(lcode:any,vchno:any,vchtype:any)
   {
     return this.http.get<any>( this.api.URL + "api/overdue/getCustomerOverDuesForEdit?lcode=" + lcode + "&entryno=" + vchno + "&vchtype=" + vchtype).pipe(map((res:any)=>{
       return res;
     }));
   }

   getPendingCustomerInvoices(lcode:any)
   {
     return this.http.get<any>( this.api.URL + "api/overdue/getCustomerOverDues?lcode=" + lcode  ).pipe(map((res:any)=>{
       return res;
     }));
   }
 
   getPendingVendorInvoices(lcode:any,branch:any,fy:any)
   {
     return this.http.get<any>( this.api.URL + "api/overdue/getVendorOverDues?lcode=" + lcode + "&branch=" + branch + "&fy=" +fy).pipe(map((res:any)=>{
       return res;
     }));
   }
 
   Insert_InvocieDueDetails(postdata: any): Observable<any> {
     return this.POST( this.api.URL + "api/overdue", postdata);
   }
 
   Insert_Voucher(postdata: any): Observable<any> {
     return this.POST( this.api.URL + "api/voucher", postdata);
   }
 
   Insert_Ledger(postdata: any): Observable<any> {
    return this.POST(this.api.URL + 'api/accountentries', postdata);
   }

   delete_ledger(vchno:any,vchtype:any,branch:any,fy:any)
   {
      return this.http.get<any>( this.api.URL + "api/accountentries/deteleAllLedger?vchno=" + vchno + "&vtype=" + vchtype + "&branch=" +branch + "&fy=" + fy  ).pipe(map((res:any)=>{
        return res;
      }));
   }

   delete_overdue(vchno:any,vchtype:any,branch:any,fy:any)
   {
      return this.http.get<any>( this.api.URL + "api/overdue/deleteOverdue?invno=" + vchno + "&vtype=" + vchtype + "&branch=" +branch + "&fy=" + fy  ).pipe(map((res:any)=>{
        return res;
      }));
   }

   delete_voucher(vchno:any,vchtype:any,branch:any,fy:any)
   {
      return this.http.get<any>( this.api.URL + "api/voucher/deleteVoucherEntry?vchno=" + vchno + "&vtype=" + vchtype + "&branch=" +branch + "&fy=" + fy  ).pipe(map((res:any)=>{
        return res;
      }));
   }

   GetVoucherList(fdate:any,tdate:any,type:any)
   {
     return this.http.get<any>( this.api.URL + "api/voucher/getVoucherList?fdate="+fdate+"&tdate="+tdate+"&vchtype=" + type).pipe(map((res:any)=>{
       return res;
     }));
   }

   getLedgerReport(lcode:any,fdate:any,tdate:any,branch:any,fy:any)
   {
     return this.http.get<any>( this.api.URL + "api/overdue/getLadgerReport?lcode="+lcode+"&fdate="+fdate+"&tdate="+tdate+"&branch=" + branch+"&fy="+fy+"").pipe(map((res:any)=>{
       return res;
     }));
   }
   
}
