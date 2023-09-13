import { ObserversModule } from '@angular/cdk/observers';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    public loaderservice: LoaderService,
    public spinner: NgxSpinnerService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinner.show();
    return next.handle(req).pipe(
      finalize(() => {
        this.spinner.hide();
      })
    );
  }
}
