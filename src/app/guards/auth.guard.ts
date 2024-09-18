import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({  providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}
  canActivate(route: ActivatedRouteSnapshot,  state: RouterStateSnapshot): boolean {
      const url: string = state.url;
      if(this.authService.isLoggedIn()){
        if (route.data['roles'] && this.rolesIndexOfRoles(route.data['roles'], this.authService.getRoles()) === -1) {
          this.router.navigate(['/']); 
          return false;
        }
        return true;
      }

      this.authService.redirectUrl = url;
      this.router.navigate(['/login'] , {queryParams: { returnUrl: url }});
      return this.authService.isLoggedIn();
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      return this.canActivate(route, state);
    }

    rolesIndexOfRoles(unstableRoles: Array<string>, roles: Array<string>) {
      let itemIndex = -1;
      unstableRoles.forEach((item, index)=>{        
        if(roles.includes(item)) {
          itemIndex = index;
        }
      });
      return itemIndex;
    }
  
}
