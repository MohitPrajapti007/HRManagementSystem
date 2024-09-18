import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-employee-detail-dialog',
  templateUrl: './employee-detail-dialog.component.html',
  styleUrls: ['./employee-detail-dialog.component.css']
})
export class EmployeeDetailDialogComponent {

  @Input() rowData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EmployeeDetailDialogComponent>
  ) {
    this.rowData = data;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
