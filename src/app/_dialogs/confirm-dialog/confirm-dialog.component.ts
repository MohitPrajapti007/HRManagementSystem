import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IConfirmDialogData } from '../../_interfaces/confirm-dialog-data';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
   dialogContentId: string = `mat-dialog-content-${parseInt(this.dialogRef.id.replace(/\D/g, ''), 10)}`;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IConfirmDialogData,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {
    dialogRef._containerInstance._config.ariaDescribedBy = this.dialogContentId;
  }

}
