import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  isSidebarPinned = false;
  isSidebarToggeled = false;

  constructor(private httpClient: HttpClient) { }

  toggleSidebar() {
    this.isSidebarToggeled = ! this.isSidebarToggeled;
  }

  toggleSidebarPin() {
    this.isSidebarPinned = ! this.isSidebarPinned;
  }

  getSidebarStat() {
    return {
      isSidebarPinned: this.isSidebarPinned,
      isSidebarToggeled: this.isSidebarToggeled
    }
  }

  getMenus() {
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/menus`);
  }
  getRoles() {
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/roles`);
  }
  getLogout() {
	  return this.httpClient.get(`${environment.config.apiContextUrl}/secure/logout`);
  }

}