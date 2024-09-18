import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { GailRoutingModule } from './gail-routing.module';
import { GailComponent } from './gail.component';
//import { MatButtonModule } from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
// import { SharedModule } from './modules/shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatSortModule} from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';
//import 'chartjs-chart-treemap';
import { UploadsComponent } from './uploads/uploads.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { MetadataComponent } from './metadata/metadata.component';
import { ReportComponent } from './report/report.component';
//import { CustomMultiselectComponent } from 'src/app/components/custom-multiselect/custom-multiselect.component';
import { SearchFilterPipe } from 'src/app/_pipes/search-filter.pipe';
import { MainReportComponent } from './main-report/main-report.component';
import { ProgressBarComponent } from 'src/app/components/progress-bar/progress-bar.component';
@NgModule({
  declarations: [
    GailComponent,
    UploadsComponent,
    SettingsComponent,
    HomeComponent,
    MetadataComponent,// CustomMultiselectComponent,
    ReportComponent,
    SearchFilterPipe,
    MainReportComponent,ProgressBarComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule, MatButtonModule, MatIconModule,MatSidenavModule,MatListModule, MatTableModule,MatCheckboxModule, MatFormFieldModule, MatSelectModule,
    MatProgressBarModule, MatCardModule, MatInputModule, FormsModule,ReactiveFormsModule, MatProgressSpinnerModule,MatPaginatorModule, 
    MatButtonToggleModule, MatSortModule, MatTabsModule,
    GailRoutingModule
  ]
})
export class GailModule { }
