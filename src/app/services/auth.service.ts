import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { mergeMap } from 'rxjs/operators';


@Injectable({ providedIn:'root' })
export class AuthService {
  redirectUrl!: string;
  TOKEN_KEY = 'gaz7LiAx';
  constructor(private router: Router, private httpClient: HttpClient/* , public translate: TranslateService */) {}

  setTokenKey(infoObject: any): void {
    localStorage.setItem(`${this.TOKEN_KEY}`, JSON.stringify(infoObject));
  }

  getTokenKey(): any | null {
    let value = localStorage.getItem(`${this.TOKEN_KEY}`);
    if(value)
       return JSON.parse(value);        
    return null;
  }

  getToken(): string | null {
    let value = this.getTokenKey();
    if(value)
       return value.token;  
    return null;
  }

  getTheme(): string | null {
    let value = this.getTokenKey();
    if(value)
       return value.theme;  
    return null;
  }
  setTheme(theme: string): void | null {
    let value = this.getTokenKey();
    if(value) {
        value.theme = theme;
    }
    this.setTokenKey(value);
  }

  getLang(): string | null {
    let value = this.getTokenKey();
    if(value)
       return value.lang;  
    return 'en';
  }

  setLang(lang: string): void | null {
    let value = this.getTokenKey();
    if(value) {
        value.lang = lang;
    }
    this.setTokenKey(value);
  }

  getRole(): string | null {
    let value = this.getTokenKey();
    if(value)
       return value.role;  
    return null;
  }
  
  getRoles(): Array<string> {
    let value = this.getTokenKey();
    if(value)
       return value.role;  
    return [];
  }
  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['']);
  }

  login(body: any): Observable<any> {    
    return this.httpClient.post(`${environment.config.apiContextUrl + "/public/access-token"}`, body)
      .pipe(
        mergeMap((result: any) => {
          if(result.code == 200) {
           // if(result.resStatus == 2000) {
                this.setTokenKey({ token : result.data.token, role: result.data.roles, lang: 'en', theme: 'Dark' });
                return of({ code: result.code, resStatus: result.resStatus, name: result.data.displayName, username: result.data.username, roles: result.data.roles }) 
              }
          //  }
            return of(result);
          }
        ));  
  } 

  
  generateCaptcha() {
	  return this.httpClient.get(`${environment.config.apiContextUrl}/captcha/generate`);
  }
  
  reloadCaptcha(captchaId: number) {
	  return this.httpClient.get(`${environment.config.apiContextUrl}/captcha/reload/${captchaId}`);
  }
  
  validateCaptcha(captchaId: number, captchaAnswer: string) {
	  const parameters = new HttpParams()
	  					.set('captchaAnswer', captchaAnswer);
	  return this.httpClient.get(`${environment.config.apiContextUrl}/captcha/validate/${captchaId}`, {params : parameters});
  }

  public forgotPassword(data:any){
    const params = new HttpParams().set('captchaAnswer', data.captcha).set('username', data.username);
    return this.httpClient.post(`${environment.config.apiContextUrl}/public/v2/forgot-password`, data);
  }
  public resetPassword(data:any) {
    return this.httpClient.post(`${environment.config.apiContextUrl}/public/reset-password`, data);
  }

}