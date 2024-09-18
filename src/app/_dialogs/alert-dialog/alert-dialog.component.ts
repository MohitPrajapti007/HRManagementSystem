import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IAlertDialogData } from '../../_interfaces/alert-dialog-data';

@Component({
  selector: 'alert-dialog',
  templateUrl: './alert-dialog.component.html'
})
export class AlertDialogComponent {
  dialogContentId: string = `mat-dialog-content-${parseInt(this.dialogRef.id.replace(/\D/g, ''), 10)}`;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IAlertDialogData,
    private dialogRef: MatDialogRef<AlertDialogComponent>
  ) {
    dialogRef._containerInstance._config.ariaDescribedBy = this.dialogContentId;
  }

}
