import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { NotFoundComponent } from './modules/not-found/not-found.component';


const routes: Routes = [
  { path: '', redirectTo:'login', pathMatch:'full' },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module')
      .then(mod => mod.LoginModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./modules/signup/signup.module')
      .then(mod => mod.SignupModule)
  },
  {
    path: 'gail',
    loadChildren: () => import('./modules/gail/gail.module')
      .then(mod => mod.GailModule)
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // initialNavigation: 'enabledBlocking'
    useHash: true,
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'    
})],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }