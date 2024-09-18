import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { NotFoundComponent } from './modules/not-found/not-found.component';

import { HeaderModule } from './components/header/header.module';
import { FooterModule } from './components/footer/footer.module';
import { InterceptorService } from './interceptor/interceptor.service';
import { TokenInterceptorService } from './interceptor/token-interceptor';
//import { NgImageSliderModule } from 'ng-image-slider';

import { MatDialogModule, MatDialogConfig, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import { AlertDialogComponent } from './_dialogs/alert-dialog/alert-dialog.component';
//import { ConfirmDialogComponent } from './_dialogs/confirm-dialog/confirm-dialog.component';
import { SessionDialogComponent } from './app.component';

import { MatListModule } from "@angular/material/list";
import { MatRadioModule } from "@angular/material/radio";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import { PreserveHtmlPipe } from './_pipes/preserve-html.pipe';

import { AppConfigService } from './app-config.service';
import { MatButtonModule } from '@angular/material/button';
// import { SharedModule } from './modules/shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import { CustomDialogComponent } from './_dialogs/custom-dialog/custom-dialog.component';
import { EmployeeDetailDialogComponent } from './_dialogs/employee-detail-dialog/employee-detail-dialog.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import {  MatSnackBarModule} from '@angular/material/snack-bar';
//import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
//import { CustomMultiselectComponent } from 'src/app/components/custom-multiselect/custom-multiselect.component';
import { BnNgIdleService } from 'bn-ng-idle';
const appConfig = (config: AppConfigService)=>{
  return()=>{ 
    return config.loadConfig();
  }
}

@NgModule({
  declarations: [
    AppComponent,    
    NotFoundComponent, AlertDialogComponent, SessionDialogComponent, CustomDialogComponent,// CustomMultiselectComponent,
    PreserveHtmlPipe,EmployeeDetailDialogComponent //ProgressBarComponent
  ],
  imports: [
    BrowserModule,BrowserAnimationsModule,FormsModule,ReactiveFormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    HttpClientModule,
    HeaderModule,// SharedModule,
    FooterModule,//NgImageSliderModule,
    MatDialogModule,MatListModule,MatRadioModule,MatIconModule, MatButtonModule,MatCardModule, MatSlideToggleModule, 
 //   MatToolbarModule, MatButtonModule, MatIconModule,
    MatFormFieldModule,MatInputModule,MatSelectModule,MatSnackBarModule
  ],
  providers: [
    AppConfigService,
    { 
      provide: APP_INITIALIZER,
      useFactory: appConfig,
      multi: true,
      deps: [AppConfigService] 
    },
	{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        ...new MatDialogConfig(),
        minWidth: "40ch",
        maxWidth: "60ch"
      } as MatDialogConfig
    },BnNgIdleService],
    exports: [
    //  SharedModule
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }