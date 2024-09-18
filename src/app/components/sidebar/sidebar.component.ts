import { Component } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
 menus:any = [];
 constructor(private appService: AppService, private authService: AuthService){
  //this.menus.push({ icon: "fa fa-tv", textName: "Dashboard", link: "/admin/dash"});
  //this.menus.push({ icon: "fas fa-gem", textName: "Forms", link: "/forms"});
  this.appService.getMenus().subscribe({
    next: (result: any)=>{
      console.log(result);
      if(result.code==200) {
        this.menus = result.data;
      }
    }
  })
  this.appService.getRoles().subscribe({
    next: (result: any)=>{
      console.log('roles: ', result);
    }
  })
 }
 logout() {
  this.appService.getLogout().subscribe({
    next: (result: any)=>{
      console.log(result);
      if(result.code==200) {
        this.authService.logout();
      }
    }
  })
 }
}
