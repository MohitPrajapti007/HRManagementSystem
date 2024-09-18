import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  changePasswordForm: FormGroup; // Declare changePasswordForm as FormGroup
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  showCurrentPassword:boolean=false;


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)]],
      confirmPassword: ['', Validators.required],
    }, { validator: this.passwordsMatchValidator });
  }

  ngOnInit() {
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')!.value;
    const confirmPassword = formGroup.get('confirmPassword')!.value;
    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      // Proceed with changing the password
      this.userService.changePassword(this.changePasswordForm.value)
        .subscribe(response => {
          // Handle success response here
          console.log('Password changed successfully!', response);

          // Show a success message as a popup
          this.snackBar.open('Password changed successfully!', 'Close', {
            duration: 5000, // Duration for which the snackbar is displayed (in milliseconds)
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          // Optionally, redirect to another page or perform other actions
        }, error => {
          // Handle error response here
          console.error('Password change failed:', error);

          // Show an error message as a popup
          this.snackBar.open('Password change failed. Please try again.', 'Close', {
            duration: 5000, // Duration for which the snackbar is displayed (in milliseconds)
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        });
    }
  }
  togglePasswordVisibility(controlName: string): void {
    if(controlName==='currentPassword'){
      this.showCurrentPassword=!this.showCurrentPassword;
    }
    else if (controlName === 'newPassword') {
      this.showNewPassword = !this.showNewPassword;
    } else if (controlName === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  
}
