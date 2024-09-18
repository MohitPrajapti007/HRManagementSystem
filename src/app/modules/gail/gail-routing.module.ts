import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GailComponent } from './gail.component';
import { SettingsComponent } from './settings/settings.component';
import { UploadsComponent } from './uploads/uploads.component';
import { HomeComponent } from './home/home.component';
import { MetadataComponent } from './metadata/metadata.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ReportComponent } from './report/report.component';
import { MainReportComponent } from './main-report/main-report.component';

const routes: Routes = [
  { path: '', component: GailComponent,
    children: [
      { path: "", component: HomeComponent, canActivate: [AuthGuard], data: {roles: ['ADMIN']}},
      { path: "home", component: HomeComponent, canActivate: [AuthGuard], data: {roles: ['ADMIN']}},
      { path: "analytics", component:  MainReportComponent, canActivate: [AuthGuard], data: {roles: ['ADMIN']}},
      { path: "uploads", component: UploadsComponent, canActivate: [AuthGuard], data: {roles: ['ADMIN']}},
      { path: "metadata", component: MetadataComponent, canActivate: [AuthGuard] , data: {roles: ['ADMIN']}},
      { path: "settings", component: SettingsComponent, canActivate: [AuthGuard] , data: {roles: ['ADMIN']}},
      { path: "report", component: ReportComponent, canActivate: [AuthGuard] , data: {roles: ['ADMIN']}}
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GailRoutingModule { }
