import { Component, OnInit } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthService } from './services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { finalize } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'path';
  footerUrl = '';
  footerLink = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object, private bnIdle: BnNgIdleService, private authService: AuthService,private _snackBar: MatSnackBar, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    let seconds = 10*60;
    this.bnIdle.startWatching(seconds).subscribe((isTimedOut: boolean) => {
      if (isTimedOut && this.authService.isLoggedIn()) {           
         this.openDialog();    
      }
    });
    if (isPlatformBrowser(this.platformId)) {
      const navMain = document.getElementById('navbarCollapse');
      if (navMain) {
        navMain.onclick = function onClick() {
          if (navMain) {
            navMain.classList.remove("show");
          }
        }
      }
    }
  } 
  dialogRef:any= null;
  dialogCounter=0;
  cancel:any = null;
  public openDialog(): void {
    if (this.dialogCounter>=1) return;
    this.dialogRef = this.dialog.open(SessionDialogComponent, {
      disableClose: true,
      autoFocus: true,
      data: {
        title: `Message ${this.seconds}`,

        cancelButtonText: "Cancel",
        confirmButtonText: "Ok",
        seconds: this.seconds
      },
      width: '800px'
    });
    this.dialogCounter++;
    let ele = document.getElementById("time-holder");
    this.cancel = setInterval(()=>{this.seconds -= 1;      
      if(ele) ele.innerText = this.seconds+" seconds";
      if(this.seconds<=0) {
        this.dialogRef.close();
        this.logoutSession();
      }
    }, 1000);
    this.dialogRef.afterClosed().subscribe((confirmed:boolean) => {
      console.log('The dialog was closed ', confirmed);
      if(confirmed) {
        if(this.cancel) {
          this.seconds = 0;
          clearInterval(this.cancel);
        }
        this.bnIdle.resetTimer();
      } else {
        this.logoutSession();
      }
      finalize(() => {this.dialogRef = undefined;this.dialogCounter=0;})
    });
  }
  seconds = 30;//seconds

  logoutSession() {
      if(this.cancel) {
        this.seconds = 0;
        clearInterval(this.cancel);
      }
        this._snackBar.open("Session time Expired", '', {
          duration: 10 * 1000,
          horizontalPosition: "center",
          verticalPosition: "top",
        }); 
        this.authService.logout();
  }

 
}




@Component({
  selector: 'confirm-dialog',
  template: `
  <h2 mat-dialog-title>Message</h2>
  <div mat-dialog-content [id]="dialogContentId" >
          <div class="row">
            <div class="col-12">Your session has not been active for the last 10 minutes. If you would like to keep your session active, please click OK.</div>
          <div>           
  </div>
  <mat-dialog-actions align="end">
  <div class="me-3" id="time-holder">{{data.seconds}} seconds</div>
    <button mat-button mat-dialog-close cdkFocusInitial>{{data.cancelButtonText}}</button>
    <button mat-button mat-dialog-close="true" color="primary">{{data.confirmButtonText}}</button>
  </mat-dialog-actions>
  `
})
export class SessionDialogComponent {
   dialogContentId: string = `mat-dialog-content-${parseInt(this.dialogRef.id.replace(/\D/g, ''), 10)}`;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SessionDialogComponent>
  ) {
    dialogRef._containerInstance._config.ariaDescribedBy = this.dialogContentId;
  }

}