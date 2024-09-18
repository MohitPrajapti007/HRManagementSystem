import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { ExamComponent } from './exam/exam.component';

@NgModule({
  declarations: [
    DashboardComponent, SidebarComponent, NavbarComponent, ExamComponent
  ],
  imports: [
    CommonModule, RouterModule
  ],
  exports: [
    SidebarComponent, NavbarComponent,
  ]
})
export class SharedModule { }
