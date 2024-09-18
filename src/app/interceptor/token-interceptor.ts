import { Injectable, InjectionToken } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, fromEvent, Observable, of, throwError } from 'rxjs';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');
export const apiWithoutHeader = [];

@Injectable({ providedIn: 'root' })
export class TokenInterceptorService implements HttpInterceptor {
    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private onlineEvent: Observable<Event>;
    private offlineEvent: Observable<Event>;
    protected defaultTimeout: number = 5;
  constructor(private _authService: AuthService) {  
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.onlineEvent.subscribe(e => {
      console.log('Application is Online');
    });
    this.offlineEvent.subscribe(e => {
      console.log('Application is Offline');
    });
  }

  intercept(request: import("@angular/common/http").HttpRequest<any>, next: import("@angular/common/http").HttpHandler): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
    const timeoutValue = request.headers.get('timeout') || this.defaultTimeout;
    const timeoutValueNumeric = Number(timeoutValue);
    let token = this._authService.getToken();
    let browserLang = this._authService.getLang();
        if (token) {
            request = request.clone({
                setHeaders: { 
                    'Authorization' : `${token}`,
                    'timezone': `${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
                    'Access-Control-Allow-Origin': `*`,
                    'Accept-Language': `${browserLang}`
                }
            });
        }
 
    return next.handle(request).pipe(
            catchError((error, caught) => {
        console.log(error);
        let obj = error.error.errors;
        if(obj) {
          let message = '';
          for (let key in obj){
            if(obj.hasOwnProperty(key)){
              message += `${key} : ${obj[key]}`;
            }
          }
        //  this.toastService.show(message);
        }
        
        handleAuthError(error);
        return of(error);
      }) as any);

      function handleAuthError(err: HttpErrorResponse): Observable<any> { 
        //handle your auth error or rethrow
        if (err.status === 403 || err.status === 401) {
            //navigate /delete cookies or whatever
            console.log('handled error ' + err.status);
            // this._alertDialogService.alert('Login Error', 'Invalid username or password', 'OK', 'md', true, false);
            // this.router.navigate([`/login`]);
                throw err;
            // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
            //  return of(err.message);
        }
        throw err;
      } 
  }
  /*
  private networkErrorScenario(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (error instanceof HttpErrorResponse) {
      const errorCode = (error as HttpErrorResponse).status;
      switch (true) {
        case (errorCode === 400):
          return this.handle400Error(error);

        case (errorCode === 401):
          return this.handle401Error(request, next);

        case (errorCode >= 500 && errorCode < 600):
          return throwError(error);

        case (errorCode === 0):
          return throwError(error);

        default:
          return throwError(error);
      }
    } else {
      return throwError(error);
    }
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;
      this.refreshTokenSubject.next(null);

      return this.getNewToken(req, next);
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(req));
        })
      );
    }
  }

  handle400Error(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (error && error.status === 400) {
      return throwError(error);
    }

    return throwError(error);
  }
  logoutUser(error: any): Observable<HttpEvent<any>> {
    return throwError(error);
  }

  apiWithNoHeaders(request: HttpRequest<object>): boolean {
    return apiWithoutHeader.includes(request.url);
  }
  */
}
